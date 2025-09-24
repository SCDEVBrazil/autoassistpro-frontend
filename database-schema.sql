-- Database Schema for AutoAssistPro Scheduling System (Multi-Client)

-- Client configurations
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weekly availability schedule (per client)
CREATE TABLE availability_schedule (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL, -- 'monday', 'tuesday', etc.
    is_available BOOLEAN DEFAULT false,
    start_time TIME NOT NULL DEFAULT '09:00:00',
    end_time TIME NOT NULL DEFAULT '17:00:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    UNIQUE(client_id, day_of_week)
);

-- Blackout dates (vacations, holidays) per client
CREATE TABLE blackout_dates (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    UNIQUE(client_id, date)
);

-- Scheduled appointments per client
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    interest VARCHAR(100), -- 'operations', 'cybersecurity', etc.
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    UNIQUE(client_id, appointment_date, appointment_time)
);

-- Appointment settings per client
CREATE TABLE appointment_settings (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL,
    setting_key VARCHAR(50) NOT NULL,
    setting_value VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    UNIQUE(client_id, setting_key)
);

-- Insert default clients
INSERT INTO clients (client_id, client_name) VALUES
('techequity', 'TechEquity Consulting'),
('autoassist-demo', 'AutoAssistPro Demo'),
('general-demo', 'General Demo Client');

-- Insert default weekly schedule for TechEquity
INSERT INTO availability_schedule (client_id, day_of_week, is_available, start_time, end_time) VALUES
('techequity', 'monday', true, '09:00:00', '17:00:00'),
('techequity', 'tuesday', true, '09:00:00', '17:00:00'),
('techequity', 'wednesday', false, '09:00:00', '17:00:00'),
('techequity', 'thursday', true, '13:00:00', '18:00:00'),
('techequity', 'friday', true, '09:00:00', '15:00:00'),
('techequity', 'saturday', false, '09:00:00', '17:00:00'),
('techequity', 'sunday', false, '09:00:00', '17:00:00');

-- Insert default weekly schedule for AutoAssistPro Demo
INSERT INTO availability_schedule (client_id, day_of_week, is_available, start_time, end_time) VALUES
('autoassist-demo', 'monday', true, '09:00:00', '17:00:00'),
('autoassist-demo', 'tuesday', true, '09:00:00', '17:00:00'),
('autoassist-demo', 'wednesday', true, '09:00:00', '17:00:00'),
('autoassist-demo', 'thursday', true, '09:00:00', '17:00:00'),
('autoassist-demo', 'friday', true, '09:00:00', '17:00:00'),
('autoassist-demo', 'saturday', false, '09:00:00', '17:00:00'),
('autoassist-demo', 'sunday', false, '09:00:00', '17:00:00');

-- Insert default settings for TechEquity
INSERT INTO appointment_settings (client_id, setting_key, setting_value) VALUES
('techequity', 'duration_minutes', '45'),
('techequity', 'buffer_minutes', '15'),
('techequity', 'advance_notice_hours', '24'),
('techequity', 'max_booking_days', '60');

-- Insert default settings for AutoAssistPro Demo
INSERT INTO appointment_settings (client_id, setting_key, setting_value) VALUES
('autoassist-demo', 'duration_minutes', '30'),
('autoassist-demo', 'buffer_minutes', '15'),
('autoassist-demo', 'advance_notice_hours', '2'),
('autoassist-demo', 'max_booking_days', '30');

-- Insert sample blackout dates for TechEquity
INSERT INTO blackout_dates (client_id, date, reason) VALUES
('techequity', '2024-12-25', 'Christmas Day'),
('techequity', '2024-12-31', 'New Year''s Eve'),
('techequity', '2024-01-01', 'New Year''s Day');

-- Insert sample appointments for TechEquity
INSERT INTO appointments (client_id, first_name, last_name, email, phone, company, interest, appointment_date, appointment_time, status) VALUES
('techequity', 'John', 'Smith', 'john@techcorp.com', '(555) 123-4567', 'TechCorp Solutions', 'operations', '2024-09-25', '10:00:00', 'confirmed'),
('techequity', 'Sarah', 'Johnson', 'sarah@innovate.io', '(555) 987-6543', 'Innovate Systems', 'cybersecurity', '2024-09-26', '14:00:00', 'confirmed'),
('techequity', 'Mike', 'Chen', 'mike@startup.com', '(555) 456-7890', 'StartupXYZ', 'digital-transformation', '2024-09-27', '11:00:00', 'pending');

-- Insert sample appointments for AutoAssistPro Demo
INSERT INTO appointments (client_id, first_name, last_name, email, phone, company, interest, appointment_date, appointment_time, status) VALUES
('autoassist-demo', 'Alice', 'Wilson', 'alice@company.com', '(555) 111-2222', 'Demo Company', 'general', '2024-09-24', '15:00:00', 'confirmed'),
('autoassist-demo', 'Bob', 'Davis', 'bob@business.com', '(555) 333-4444', 'Demo Business', 'general', '2024-09-25', '11:00:00', 'confirmed');