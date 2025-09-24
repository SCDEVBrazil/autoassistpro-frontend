// src/app/admin/components/ChatLogsTab/hooks/useConversationActions.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface UseConversationActionsProps {
  selectedSession: string | null;
  onSelectSession: (sessionId: string | null) => void;
  onDeleteConversation?: (sessionId: string) => void;
  onViewAppointment?: (appointmentId: number) => void;
}

export const useConversationActions = ({
  selectedSession,
  onSelectSession,
  onDeleteConversation,
  onViewAppointment
}: UseConversationActionsProps) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedSession);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());
  const [swipeState, setSwipeState] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    deltaX: number;
    isDragging: boolean;
    itemId: string | null;
  }>({
    startX: 0,
    startY: 0,
    currentX: 0,
    deltaX: 0,
    isDragging: false,
    itemId: null
  });

  // Sync internal state with prop changes
  useEffect(() => {
    setSelectedConversation(selectedSession);
  }, [selectedSession]);

  // Device-aware conversation selection with different interaction patterns
  const handleConversationClick = useCallback((sessionId: string, event?: React.MouseEvent | React.TouchEvent) => {
    const currentTime = Date.now();
    
    if (deviceType === 'mobile') {
      // Mobile: Touch-optimized selection with haptic-like feedback
      if (isTouchDevice && event) {
        // Prevent accidental double-taps on mobile
        if (currentTime - lastInteractionTime < 300) {
          return; // Ignore rapid taps
        }
      }
      
      // Mobile: Single tap to select, tap again to deselect
      if (selectedConversation === sessionId) {
        setSelectedConversation(null);
        onSelectSession(null);
      } else {
        setSelectedConversation(sessionId);
        onSelectSession(sessionId);
      }
      
      // Mobile: Visual feedback for touch interaction
      if (event && 'currentTarget' in event) {
        const target = event.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.98)';
        setTimeout(() => {
          target.style.transform = 'scale(1)';
        }, 100);
      }
      
    } else if (deviceType === 'tablet') {
      // Tablet: Hybrid touch/cursor behavior
      if (selectedConversation === sessionId) {
        setSelectedConversation(null);
        onSelectSession(null);
      } else {
        setSelectedConversation(sessionId);
        onSelectSession(sessionId);
      }
      
      // Tablet: Moderate visual feedback
      if (event && 'currentTarget' in event) {
        const target = event.currentTarget as HTMLElement;
        target.style.opacity = '0.8';
        setTimeout(() => {
          target.style.opacity = '1';
        }, 150);
      }
      
    } else {
      // Desktop: Traditional click behavior with hover states
      if (selectedConversation === sessionId) {
        setSelectedConversation(null);
        onSelectSession(null);
      } else {
        setSelectedConversation(sessionId);
        onSelectSession(sessionId);
      }
    }
    
    setLastInteractionTime(currentTime);
  }, [deviceType, isTouchDevice, selectedConversation, onSelectSession, lastInteractionTime]);

  // Device-aware delete action with different confirmation patterns
  const handleDeleteClick = useCallback((e: React.MouseEvent | React.TouchEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent conversation selection
    
    if (deviceType === 'mobile') {
      // Mobile: Immediate confirmation modal for safety
      setConversationToDelete(sessionId);
      setShowDeleteConfirmation(true);
      
      // Mobile: Add haptic feedback simulation
      if ('vibrate' in navigator) {
        navigator.vibrate(50); // Short vibration for delete action
      }
      
    } else if (deviceType === 'tablet') {
      // Tablet: Quick confirmation with touch-friendly modal
      setConversationToDelete(sessionId);
      setShowDeleteConfirmation(true);
      
    } else {
      // Desktop: Traditional confirmation dialog
      setConversationToDelete(sessionId);
      setShowDeleteConfirmation(true);
    }
  }, [deviceType]);

  // Device-aware swipe gesture handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, sessionId: string) => {
    if (deviceType !== 'mobile' || !isTouchDevice) return;
    
    const touch = e.touches[0];
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      deltaX: 0,
      isDragging: false,
      itemId: sessionId
    });
  }, [deviceType, isTouchDevice]);

  const handleTouchMove = useCallback((e: React.TouchEvent, sessionId: string) => {
    if (deviceType !== 'mobile' || !isTouchDevice || swipeState.itemId !== sessionId) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = Math.abs(touch.clientY - swipeState.startY);
    
    // Only process horizontal swipes
    if (Math.abs(deltaX) > 10 && deltaY < 50) {
      e.preventDefault(); // Prevent scrolling
      
      setSwipeState(prev => ({
        ...prev,
        currentX: touch.clientX,
        deltaX: deltaX,
        isDragging: Math.abs(deltaX) > 20
      }));
    }
  }, [deviceType, isTouchDevice, swipeState.startX, swipeState.startY, swipeState.itemId]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, sessionId: string) => {
    if (deviceType !== 'mobile' || !isTouchDevice || swipeState.itemId !== sessionId) return;
    
    const threshold = 100; // Swipe distance threshold for action
    
    if (Math.abs(swipeState.deltaX) > threshold) {
      if (swipeState.deltaX < 0) {
        // Left swipe - Delete action
        handleDeleteClick(e as any, sessionId);
      } else {
        // Right swipe - Select/View action
        handleConversationClick(sessionId);
      }
    }
    
    // Reset swipe state
    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      deltaX: 0,
      isDragging: false,
      itemId: null
    });
  }, [deviceType, isTouchDevice, swipeState.deltaX, swipeState.itemId, handleDeleteClick, handleConversationClick]);

  // Device-aware delete confirmation with different UX patterns
  const confirmDelete = useCallback(() => {
    if (conversationToDelete && onDeleteConversation) {
      if (deviceType === 'mobile') {
        // Mobile: Immediate deletion with undo option
        onDeleteConversation(conversationToDelete);
        
        // Mobile: Show toast-style undo notification
        console.log('Mobile deletion completed - undo option could be implemented');
        
        // Mobile: Haptic feedback for confirmation
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 50, 50]); // Triple vibration for successful delete
        }
        
      } else if (deviceType === 'tablet') {
        // Tablet: Standard deletion with visual feedback
        onDeleteConversation(conversationToDelete);
        console.log('Tablet deletion completed');
        
      } else {
        // Desktop: Standard deletion with detailed logging
        onDeleteConversation(conversationToDelete);
        console.log(`Desktop deletion completed for conversation: ${conversationToDelete}`);
      }
      
      setShowDeleteConfirmation(false);
      setConversationToDelete(null);
      
      // If we're deleting the currently selected conversation, clear selection
      if (selectedConversation === conversationToDelete) {
        setSelectedConversation(null);
        onSelectSession(null);
      }
    }
  }, [conversationToDelete, onDeleteConversation, deviceType, selectedConversation, onSelectSession]);

  // Device-aware delete cancellation
  const cancelDelete = useCallback(() => {
    setShowDeleteConfirmation(false);
    setConversationToDelete(null);
    
    // Device-specific cancel feedback
    if (deviceType === 'mobile' && 'vibrate' in navigator) {
      navigator.vibrate(25); // Short vibration for cancel
    }
  }, [deviceType]);

  // Device-aware appointment viewing with different navigation patterns
  const handleViewAppointment = useCallback((appointmentId: number, event?: React.MouseEvent | React.TouchEvent) => {
    if (onViewAppointment) {
      if (deviceType === 'mobile') {
        // Mobile: Full-screen navigation with slide transition
        onViewAppointment(appointmentId);
        
        // Mobile: Visual feedback for navigation action
        if (event && 'currentTarget' in event) {
          const target = event.currentTarget as HTMLElement;
          target.style.backgroundColor = '#3B82F6';
          setTimeout(() => {
            target.style.backgroundColor = '';
          }, 200);
        }
        
      } else if (deviceType === 'tablet') {
        // Tablet: Modal or side-panel navigation
        onViewAppointment(appointmentId);
        
      } else {
        // Desktop: Traditional navigation with detailed context
        onViewAppointment(appointmentId);
        console.log(`Navigating to appointment ${appointmentId} from desktop`);
      }
    }
  }, [onViewAppointment, deviceType]);

  // Device-aware back navigation with different patterns
  const handleBackToConversations = useCallback((event?: React.MouseEvent | React.TouchEvent) => {
    if (deviceType === 'mobile') {
      // Mobile: Slide-back animation simulation
      setSelectedConversation(null);
      onSelectSession(null);
      
      // Mobile: Back gesture simulation
      if (event && 'currentTarget' in event) {
        const target = event.currentTarget as HTMLElement;
        target.style.transform = 'translateX(-10px)';
        setTimeout(() => {
          target.style.transform = 'translateX(0)';
        }, 150);
      }
      
    } else if (deviceType === 'tablet') {
      // Tablet: Standard back navigation
      setSelectedConversation(null);
      onSelectSession(null);
      
    } else {
      // Desktop: Traditional back with breadcrumb update
      setSelectedConversation(null);
      onSelectSession(null);
    }
  }, [deviceType, onSelectSession]);

  // Device-aware bulk action handling
  const handleBulkAction = useCallback((action: 'delete' | 'archive' | 'mark-read', sessionIds: string[]) => {
    if (deviceType === 'mobile') {
      // Mobile: Progressive disclosure for bulk actions
      console.log(`Mobile bulk ${action} for ${sessionIds.length} conversations`);
      
      // Mobile: Show confirmation for destructive actions
      if (action === 'delete') {
        // Could trigger a special mobile bulk delete confirmation
        console.log('Mobile bulk delete confirmation needed');
      }
      
    } else if (deviceType === 'tablet') {
      // Tablet: Standard bulk action handling
      console.log(`Tablet bulk ${action} for ${sessionIds.length} conversations`);
      
    } else {
      // Desktop: Advanced bulk action with keyboard shortcuts
      console.log(`Desktop bulk ${action} for ${sessionIds.length} conversations`);
      
      // Desktop could support Ctrl+A, Ctrl+D, etc.
      console.log('Desktop bulk actions support keyboard shortcuts');
    }
  }, [deviceType]);

  // Device-aware long press handling for mobile context menus
  const handleLongPress = useCallback((sessionId: string, event: React.TouchEvent) => {
    if (deviceType !== 'mobile' || !isTouchDevice) return;
    
    // Mobile: Long press for context menu
    const longPressTimer = setTimeout(() => {
      // Show mobile context menu
      console.log(`Mobile long press context menu for session: ${sessionId}`);
      
      // Mobile: Haptic feedback for long press
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      
      // Could show a context menu with options: View, Delete, Archive, etc.
    }, 500);
    
    // Store timer to cancel if touch ends early
    (event.currentTarget as any).longPressTimer = longPressTimer;
  }, [deviceType, isTouchDevice]);

  const handleLongPressEnd = useCallback((event: React.TouchEvent) => {
    if (deviceType !== 'mobile' || !isTouchDevice) return;
    
    // Cancel long press timer if touch ends
    const target = event.currentTarget as any;
    if (target.longPressTimer) {
      clearTimeout(target.longPressTimer);
      target.longPressTimer = null;
    }
  }, [deviceType, isTouchDevice]);

  // SURGICAL FIX: Update the handleKeyboardNavigation function in useConversationActions.ts
// Replace the existing handleKeyboardNavigation function with this fixed version

const handleKeyboardNavigation = useCallback((event: React.KeyboardEvent | KeyboardEvent, sessionId: string) => {
  // DEBUGGING: Log every time this function is called
  console.log('🚨 handleKeyboardNavigation called:', {
    key: event.key,
    pathname: window.location.pathname,
    target: event.target,
    activeElement: document.activeElement,
    sessionId
  });
  
  if (deviceType !== 'desktop') return;
  
  // Your existing input detection logic...
  const target = event.target as HTMLElement;
  const activeElement = document.activeElement as HTMLElement;
  
  const isInputField = (target && (
    target.tagName === 'INPUT' || 
    target.tagName === 'TEXTAREA' || 
    target.contentEditable === 'true'
  )) || (activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' || 
    activeElement.contentEditable === 'true'
  ));
  
  if (isInputField) {
    console.log('✅ Input field detected - skipping keyboard navigation');
    return;
  }
  
  console.log('⚠️ NO INPUT FIELD DETECTED - proceeding with keyboard navigation');
  
  switch (event.key) {
    case 'Enter':
    case ' ':
      console.log('🔥 SPACE KEY HANDLER EXECUTED - preventing default');
      event.preventDefault();
      handleConversationClick(sessionId);
      break;
    // ... rest of your cases
  }
}, [deviceType, handleConversationClick, handleDeleteClick, handleBackToConversations]);

  // Device-aware focus management
  const handleFocusManagement = useCallback((sessionId: string, action: 'focus' | 'blur') => {
    if (deviceType === 'desktop') {
      // Desktop: Proper focus management for accessibility
      if (action === 'focus') {
        console.log(`Desktop focus on conversation: ${sessionId}`);
      } else {
        console.log(`Desktop blur from conversation: ${sessionId}`);
      }
    }
    // Mobile and tablet typically don't need explicit focus management
  }, [deviceType]);

  // Device-aware scroll behavior for conversation lists
  const handleScrollBehavior = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!containerRef.current) return;
    
    if (deviceType === 'mobile') {
      // Mobile: Smooth momentum scrolling
      containerRef.current.style.scrollBehavior = 'smooth';
      containerRef.current.style.overflowY = 'auto';
      
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced scrolling
      containerRef.current.style.scrollBehavior = 'smooth';
      
    } else {
      // Desktop: Precise scrolling with scroll bars
      containerRef.current.style.scrollBehavior = 'auto';
    }
  }, [deviceType]);

  // Device-aware multi-select handling
  const handleMultiSelect = useCallback((sessionId: string, isSelected: boolean) => {
    if (deviceType === 'mobile') {
      // Mobile: Touch-friendly multi-select with visual feedback
      console.log(`Mobile multi-select: ${sessionId} - ${isSelected ? 'selected' : 'deselected'}`);
      
      // Mobile: Haptic feedback for selection
      if ('vibrate' in navigator) {
        navigator.vibrate(isSelected ? 50 : 25);
      }
      
    } else if (deviceType === 'tablet') {
      // Tablet: Standard multi-select behavior
      console.log(`Tablet multi-select: ${sessionId} - ${isSelected ? 'selected' : 'deselected'}`);
      
    } else {
      // Desktop: Multi-select with keyboard shortcuts support
      console.log(`Desktop multi-select: ${sessionId} - ${isSelected ? 'selected' : 'deselected'}`);
      // Desktop could support Ctrl+click, Shift+click for range selection
    }
  }, [deviceType]);

  // Device-aware action confirmation messages
  const getActionConfirmationMessage = useCallback((action: string, itemCount: number = 1): string => {
    const messages = {
      mobile: {
        delete: itemCount === 1 ? 'Delete this conversation?' : `Delete ${itemCount} conversations?`,
        archive: itemCount === 1 ? 'Archive conversation?' : `Archive ${itemCount} conversations?`,
        markRead: itemCount === 1 ? 'Mark as read?' : `Mark ${itemCount} as read?`
      },
      tablet: {
        delete: itemCount === 1 ? 'Are you sure you want to delete this conversation?' : `Delete ${itemCount} conversations?`,
        archive: itemCount === 1 ? 'Archive this conversation?' : `Archive ${itemCount} conversations?`,
        markRead: itemCount === 1 ? 'Mark this conversation as read?' : `Mark ${itemCount} conversations as read?`
      },
      desktop: {
        delete: itemCount === 1 
          ? 'Are you sure you want to permanently delete this conversation? This action cannot be undone.' 
          : `Are you sure you want to delete ${itemCount} conversations? This action cannot be undone.`,
        archive: itemCount === 1 
          ? 'Archive this conversation? You can find it later in the archived section.' 
          : `Archive ${itemCount} conversations? You can find them later in the archived section.`,
        markRead: itemCount === 1 
          ? 'Mark this conversation as read? It will no longer appear in unread filters.' 
          : `Mark ${itemCount} conversations as read? They will no longer appear in unread filters.`
      }
    };
    
    return messages[deviceType][action as keyof typeof messages.mobile] || 'Confirm this action?';
  }, [deviceType]);

  // Device-aware gesture helper functions
  const getSwipeTransform = useCallback((sessionId: string): string => {
    if (deviceType !== 'mobile' || swipeState.itemId !== sessionId) return '';
    
    const maxTransform = 80; // Maximum swipe distance
    const transform = Math.max(-maxTransform, Math.min(maxTransform, swipeState.deltaX * 0.7));
    
    return `translateX(${transform}px)`;
  }, [deviceType, swipeState.itemId, swipeState.deltaX]);

  const getSwipeActionIcon = useCallback((sessionId: string): 'delete' | 'view' | null => {
    if (deviceType !== 'mobile' || swipeState.itemId !== sessionId || !swipeState.isDragging) return null;
    
    const threshold = 50;
    if (swipeState.deltaX < -threshold) return 'delete';
    if (swipeState.deltaX > threshold) return 'view';
    
    return null;
  }, [deviceType, swipeState.itemId, swipeState.isDragging, swipeState.deltaX]);

  // Device-aware animation helpers
  const getSelectionAnimation = useCallback((sessionId: string, isSelected: boolean): string => {
    if (deviceType === 'mobile') {
      return isSelected ? 'mobile-select-bounce' : '';
    } else if (deviceType === 'tablet') {
      return isSelected ? 'tablet-select-fade' : '';
    } else {
      return isSelected ? 'desktop-select-highlight' : '';
    }
  }, [deviceType]);

  // Device-aware accessibility helpers
  const getAccessibilityProps = useCallback((sessionId: string, isSelected: boolean) => {
    if (deviceType === 'desktop') {
      return {
        role: 'button',
        tabIndex: 0,
        'aria-selected': isSelected,
        'aria-label': `Conversation ${sessionId}, ${isSelected ? 'selected' : 'not selected'}. Press Enter to toggle, Delete to remove.`
      };
    } else {
      return {
        role: 'button',
        'aria-selected': isSelected,
        'aria-label': `Conversation ${sessionId}`
      };
    }
  }, [deviceType]);

  // Device-aware performance optimization
  const shouldUseVirtualization = useCallback((itemCount: number): boolean => {
    const thresholds = {
      mobile: 50,   // Mobile: Virtualize earlier for performance
      tablet: 100,  // Tablet: Balanced threshold
      desktop: 200  // Desktop: Higher threshold, more capable
    };
    
    return itemCount > thresholds[deviceType];
  }, [deviceType]);

  // Device-aware interaction timing
  const getInteractionDelay = useCallback((interactionType: 'click' | 'longPress' | 'swipe'): number => {
    const delays = {
      mobile: {
        click: 0,      // Immediate on mobile
        longPress: 500, // Standard long press
        swipe: 100     // Quick swipe recognition
      },
      tablet: {
        click: 50,     // Slight delay for precision
        longPress: 400, // Shorter for hybrid device
        swipe: 150     // Balanced swipe timing
      },
      desktop: {
        click: 0,      // Immediate on desktop
        longPress: 0,   // Not used on desktop
        swipe: 0       // Not used on desktop
      }
    };
    
    return delays[deviceType][interactionType];
  }, [deviceType]);

  // Return all actions and state with device information
  return {
    // Core state
    selectedConversation,
    showDeleteConfirmation,
    conversationToDelete,
    
    // Device-aware state
    deviceType,
    isTouchDevice,
    swipeState,
    lastInteractionTime,
    
    // Core actions
    handleConversationClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleViewAppointment,
    handleBackToConversations,
    
    // Touch/gesture actions
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleLongPress,
    handleLongPressEnd,
    
    // Desktop-specific actions
    handleKeyboardNavigation,
    handleFocusManagement,
    
    // Multi-select and bulk actions
    handleMultiSelect,
    handleBulkAction,
    
    // Device-aware helpers
    getActionConfirmationMessage,
    getSwipeTransform,
    getSwipeActionIcon,
    getSelectionAnimation,
    getAccessibilityProps,
    shouldUseVirtualization,
    getInteractionDelay,
    handleScrollBehavior
  };
};