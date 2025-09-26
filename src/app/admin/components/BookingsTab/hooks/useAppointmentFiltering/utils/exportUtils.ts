// Appointment Data Export Utilities
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/utils/exportUtils.ts

import { Appointment } from '../../../../../types';

export type ExportFormat = 'csv' | 'json' | 'excel';
export type ExportScope = 'current-page' | 'filtered-results' | 'all-data';

export interface ExportOptions {
  format: ExportFormat;
  scope: ExportScope;
  includeHeaders: boolean;
  includeChatSessionId: boolean;
  dateFormat: 'iso' | 'us' | 'eu';
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  recordCount: number;
  fileSize?: number;
  error?: string;
}

export interface UseFilterExportReturn {
  exportResults: (appointments: Appointment[], options: ExportOptions) => Promise<ExportResult>;
  getExportOptions: () => ExportOptions;
  validateExportData: (appointments: Appointment[]) => { isValid: boolean; message?: string };
  estimateExportSize: (appointments: Appointment[], format: ExportFormat) => number;
}

export const useFilterExport = (deviceType: 'mobile' | 'tablet' | 'desktop'): UseFilterExportReturn => {
  
  // Device-specific export limits
  const getExportLimits = () => {
    switch (deviceType) {
      case 'mobile':
        return { maxRecords: 500, maxFileSizeMB: 5 };
      case 'tablet':
        return { maxRecords: 2000, maxFileSizeMB: 15 };
      case 'desktop':
        return { maxRecords: 10000, maxFileSizeMB: 50 };
      default:
        return { maxRecords: 1000, maxFileSizeMB: 10 };
    }
  };

  // Format date according to specified format
  const formatDate = (dateString: string, format: 'iso' | 'us' | 'eu'): string => {
    const date = new Date(dateString);
    
    switch (format) {
      case 'iso':
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      case 'us':
        return date.toLocaleDateString('en-US'); // MM/DD/YYYY
      case 'eu':
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
      default:
        return dateString;
    }
  };

  // Format time for export
  const formatTime = (timeString: string): string => {
    try {
      // Convert 24-hour to 12-hour format for better readability
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString; // Return original if parsing fails
    }
  };

  // Prepare appointment data for export
  const prepareExportData = (appointments: Appointment[], options: ExportOptions) => {
    return appointments.map((appointment, index) => {
      const baseData = {
        'ID': appointment.id,
        'First Name': appointment.firstName,
        'Last Name': appointment.lastName,
        'Email': appointment.email,
        'Phone': appointment.phone || '',
        'Company': appointment.company || '',
        'Interest': appointment.interest || 'General',
        'Date': formatDate(appointment.date, options.dateFormat),
        'Time': formatTime(appointment.time),
        'Status': appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1),
        'Created': appointment.createdAt ? formatDate(appointment.createdAt, options.dateFormat) : '',
        'Updated': appointment.updatedAt ? formatDate(appointment.updatedAt, options.dateFormat) : ''
      };

      // Include chat session ID if requested
      if (options.includeChatSessionId) {
        return {
          ...baseData,
          'Chat Session ID': appointment.chatSessionId || 'N/A'
        };
      }

      return baseData;
    });
  };

  // Generate CSV content
  const generateCSV = (data: any[], includeHeaders: boolean): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];

    // Add headers if requested
    if (includeHeaders) {
      csvRows.push(headers.map(header => `"${header}"`).join(','));
    }

    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes for CSV safety
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  // Generate JSON content
  const generateJSON = (data: any[]): string => {
    return JSON.stringify({
      exportInfo: {
        timestamp: new Date().toISOString(),
        recordCount: data.length,
        exportedBy: 'AutoAssistPro Admin Panel'
      },
      appointments: data
    }, null, 2);
  };

  // Generate filename
  const generateFilename = (options: ExportOptions, recordCount: number): string => {
    if (options.filename) {
      return options.filename;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const scope = options.scope.replace('-', '_');
    const extension = options.format === 'excel' ? 'xlsx' : options.format;
    
    return `appointments_${scope}_${recordCount}_${timestamp}_${deviceType}.${extension}`;
  };

  // Estimate export file size
  const estimateExportSize = (appointments: Appointment[], format: ExportFormat): number => {
    if (appointments.length === 0) return 0;

    // Average character count per appointment record
    const avgCharsPerRecord = 200; // Rough estimate
    const totalChars = appointments.length * avgCharsPerRecord;

    switch (format) {
      case 'csv':
        return totalChars; // Roughly 1 byte per character
      case 'json':
        return totalChars * 1.5; // JSON has more overhead
      case 'excel':
        return totalChars * 2; // Excel files are larger
      default:
        return totalChars;
    }
  };

  // Validate export data
  const validateExportData = (appointments: Appointment[]): { isValid: boolean; message?: string } => {
    const limits = getExportLimits();

    if (appointments.length === 0) {
      return {
        isValid: false,
        message: 'No appointments to export'
      };
    }

    if (appointments.length > limits.maxRecords) {
      return {
        isValid: false,
        message: `Export limit exceeded. Maximum ${limits.maxRecords} records allowed on ${deviceType}`
      };
    }

    // Check for required fields
    const missingData = appointments.some(apt => !apt.firstName || !apt.lastName || !apt.email);
    if (missingData) {
      return {
        isValid: true, // Allow but warn
        message: 'Some appointments have missing required fields'
      };
    }

    return { isValid: true };
  };

  // Main export function
  const exportResults = async (appointments: Appointment[], options: ExportOptions): Promise<ExportResult> => {
    try {
      console.log(`Starting export: ${appointments.length} appointments as ${options.format} on ${deviceType}`);

      // Validate data
      const validation = validateExportData(appointments);
      if (!validation.isValid) {
        return {
          success: false,
          filename: '',
          recordCount: 0,
          error: validation.message
        };
      }

      // Prepare data
      const exportData = prepareExportData(appointments, options);
      const filename = generateFilename(options, exportData.length);

      let fileContent: string;
      let mimeType: string;

      // Generate content based on format
      switch (options.format) {
        case 'csv':
          fileContent = generateCSV(exportData, options.includeHeaders);
          mimeType = 'text/csv';
          break;

        case 'json':
          fileContent = generateJSON(exportData);
          mimeType = 'application/json';
          break;

        case 'excel':
          // For now, export as CSV with .xlsx extension
          // In a real implementation, you'd use a library like SheetJS
          fileContent = generateCSV(exportData, true);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          console.warn('Excel export not fully implemented - using CSV format');
          break;

        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      // Check file size
      const fileSizeBytes = new Blob([fileContent]).size;
      const fileSizeMB = fileSizeBytes / (1024 * 1024);
      const limits = getExportLimits();

      if (fileSizeMB > limits.maxFileSizeMB) {
        return {
          success: false,
          filename: '',
          recordCount: 0,
          error: `File too large (${fileSizeMB.toFixed(1)}MB). Maximum ${limits.maxFileSizeMB}MB allowed on ${deviceType}`
        };
      }

      // Trigger download
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Ensure link is in DOM for Firefox compatibility
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);

      console.log(`Export successful: ${filename} (${fileSizeMB.toFixed(2)}MB)`);

      return {
        success: true,
        filename,
        recordCount: exportData.length,
        fileSize: fileSizeBytes
      };

    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        filename: '',
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  };

  // Get default export options based on device
  const getExportOptions = (): ExportOptions => ({
    format: 'csv',
    scope: 'filtered-results',
    includeHeaders: true,
    includeChatSessionId: deviceType !== 'mobile', // Exclude on mobile for simplicity
    dateFormat: 'us',
    filename: undefined // Auto-generate
  });

  return {
    exportResults,
    getExportOptions,
    validateExportData,
    estimateExportSize
  };
};