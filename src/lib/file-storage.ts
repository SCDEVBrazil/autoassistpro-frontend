// src/lib/file-storage.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const AVAILABILITY_FILE = path.join(DATA_DIR, 'availability.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default availability data
const defaultAvailabilityData = {
  'techequity': {
    monday: { enabled: false, start: '09:00', end: '17:00' },
    tuesday: { enabled: false, start: '09:00', end: '17:00' },
    wednesday: { enabled: false, start: '09:00', end: '17:00' },
    thursday: { enabled: false, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '16:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' }
  },
  'autoassist-demo': {
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' }
  }
};

// Default appointments data
const defaultAppointmentsData = {
  'techequity': [],
  'autoassist-demo': []
};

// Default settings data
const defaultSettingsData = {
  'techequity': {
    duration: 45,
    bufferTime: 15,
    advanceNotice: 24,
    maxBookingWindow: 60
  },
  'autoassist-demo': {
    duration: 30,
    bufferTime: 15,
    advanceNotice: 2,
    maxBookingWindow: 30
  }
};

// Availability functions
export function getAvailabilityData() {
  try {
    if (!fs.existsSync(AVAILABILITY_FILE)) {
      fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(defaultAvailabilityData, null, 2));
      return defaultAvailabilityData;
    }
    const data = fs.readFileSync(AVAILABILITY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading availability data:', error);
    return defaultAvailabilityData;
  }
}

export function saveAvailabilityData(data: any) {
  try {
    fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(data, null, 2));
    console.log('Availability data saved to file');
  } catch (error) {
    console.error('Error saving availability data:', error);
  }
}

// Appointments functions
export function getAppointmentsData() {
  try {
    if (!fs.existsSync(APPOINTMENTS_FILE)) {
      fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(defaultAppointmentsData, null, 2));
      return defaultAppointmentsData;
    }
    const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading appointments data:', error);
    return defaultAppointmentsData;
  }
}

export function saveAppointmentsData(data: any) {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(data, null, 2));
    console.log('Appointments data saved to file');
  } catch (error) {
    console.error('Error saving appointments data:', error);
  }
}

export function addAppointment(clientId: string, appointment: any) {
  const appointmentsData = getAppointmentsData();
  if (!appointmentsData[clientId]) {
    appointmentsData[clientId] = [];
  }
  appointmentsData[clientId].push(appointment);
  saveAppointmentsData(appointmentsData);
  console.log('Added appointment for', clientId, appointment);
}

// Settings functions
export function getSettingsData() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettingsData, null, 2));
      return defaultSettingsData;
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings data:', error);
    return defaultSettingsData;
  }
}

export function saveSettingsData(data: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
    console.log('Settings data saved to file');
  } catch (error) {
    console.error('Error saving settings data:', error);
  }
}

export function updateSettings(clientId: string, settings: any) {
  const settingsData = getSettingsData();
  settingsData[clientId] = { ...settings };
  saveSettingsData(settingsData);
  console.log('Updated settings for', clientId, settings);
}