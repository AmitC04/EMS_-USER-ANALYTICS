-- ============================================
-- Analytics Migration SQL
-- Based on: User Activity Analytics v1.1 Business Requirement Document
-- ============================================

-- ================================
-- 1. USER ACTIVITY TABLE (DROP & RECREATE)
-- ================================
DROP TABLE IF EXISTS user_activity;

CREATE TABLE user_activity (
  activity_id BIGINT NOT NULL AUTO_INCREMENT,

  -- Identity
  user_id INT DEFAULT NULL,              -- NULL for guest users
  session_id VARCHAR(100) NOT NULL,
  is_guest BOOLEAN DEFAULT FALSE,

  -- Core event
  event_type ENUM(
    -- Auth
    'login_success','login_failed','logout',
    'register_email','register_google',
    'password_changed','password_reset_request','password_reset_success',

    -- Session / navigation
    'session_start','session_end','page_view',

    -- Commerce funnel
    'add_to_cart','remove_from_cart','checkout_started',
    'payment_initiated','payment_success','payment_failed',

    -- Product engagement
    'certification_view','practice_test_start','final_test_start',

    -- Feedback & system
    'review_submitted','site_error'
  ) NOT NULL,

  -- Context
  page_url VARCHAR(500) DEFAULT NULL,
  referrer_url VARCHAR(500) DEFAULT NULL,

  -- Device & network
  device_type ENUM('desktop','mobile','tablet') DEFAULT NULL,
  browser_name VARCHAR(100) DEFAULT NULL,
  ip_address VARCHAR(50) DEFAULT NULL,

  -- Geo (IP-based, MS Clarity compatible)
  geo_country VARCHAR(100) DEFAULT NULL,
  geo_city VARCHAR(100) DEFAULT NULL,

  -- Commerce linking (lightweight)
  order_id BIGINT DEFAULT NULL,
  amount DECIMAL(10,2) DEFAULT NULL,
  currency VARCHAR(10) DEFAULT 'INR',

  -- Timing
  event_time DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Flexible extension
  metadata JSON DEFAULT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (activity_id),
  KEY idx_user_activity_user (user_id),
  KEY idx_user_activity_event (event_type),
  KEY idx_user_activity_session (session_id),
  KEY idx_user_activity_time (event_time),
  KEY idx_user_activity_order (order_id),

  CONSTRAINT fk_user_activity_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ================================
-- 2. USER SESSIONS TABLE
-- (For current logged-in users & concurrency)
-- ================================
DROP TABLE IF EXISTS user_sessions;

CREATE TABLE user_sessions (
  session_id VARCHAR(100) NOT NULL,
  user_id INT DEFAULT NULL,
  is_guest BOOLEAN DEFAULT FALSE,

  auth_method ENUM('email','google','guest') DEFAULT 'guest',

  login_time DATETIME NOT NULL,
  logout_time DATETIME DEFAULT NULL,
  last_seen_at DATETIME NOT NULL,

  ip_address VARCHAR(50) DEFAULT NULL,
  geo_country VARCHAR(100) DEFAULT NULL,
  geo_city VARCHAR(100) DEFAULT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (session_id),
  KEY idx_user_sessions_active (logout_time, last_seen_at),
  KEY idx_user_sessions_user (user_id),
  KEY idx_user_sessions_login_time (login_time),

  CONSTRAINT fk_user_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ================================
-- 3. USER AUDIT LOG (SECURITY / PROFILE CHANGES)
-- ================================
DROP TABLE IF EXISTS user_audit_log;

CREATE TABLE user_audit_log (
  audit_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,

  action_type ENUM(
    'password_changed','profile_updated','email_changed',
    'role_changed','account_locked','account_unlocked'
  ) NOT NULL,

  performed_by INT DEFAULT NULL, -- admin or self
  ip_address VARCHAR(50) DEFAULT NULL,

  old_value JSON DEFAULT NULL,
  new_value JSON DEFAULT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (audit_id),
  KEY idx_audit_user (user_id),
  KEY idx_audit_action (action_type),
  KEY idx_audit_created_at (created_at),

  CONSTRAINT fk_audit_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_audit_performed_by
    FOREIGN KEY (performed_by) REFERENCES users(user_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ================================
-- 4. USERS TABLE (MINIMAL ADDITIONS)
-- ================================
-- Check if columns exist before adding (safe for re-running)
SET @col_exists_auth = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'auth_provider'
);

SET @col_exists_pwd = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'password_changed_at'
);

SET @sql_auth = IF(@col_exists_auth = 0,
  'ALTER TABLE users ADD COLUMN auth_provider ENUM(''EMAIL'', ''GOOGLE'') DEFAULT ''EMAIL'' AFTER email',
  'SELECT ''Column auth_provider already exists'' AS message'
);

SET @sql_pwd = IF(@col_exists_pwd = 0,
  'ALTER TABLE users ADD COLUMN password_changed_at DATETIME DEFAULT NULL AFTER password_hash',
  'SELECT ''Column password_changed_at already exists'' AS message'
);

PREPARE stmt_auth FROM @sql_auth;
EXECUTE stmt_auth;
DEALLOCATE PREPARE stmt_auth;

PREPARE stmt_pwd FROM @sql_pwd;
EXECUTE stmt_pwd;
DEALLOCATE PREPARE stmt_pwd;

-- Add index for auth_provider if it doesn't exist
SET @idx_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND INDEX_NAME = 'idx_users_auth_provider'
);

SET @sql_idx = IF(@idx_exists = 0,
  'CREATE INDEX idx_users_auth_provider ON users (auth_provider)',
  'SELECT ''Index idx_users_auth_provider already exists'' AS message'
);

PREPARE stmt_idx FROM @sql_idx;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;

-- ================================
-- Migration Complete
-- ================================
-- Tables created:
--   - user_activity (recreated to match Word document spec)
--   - user_sessions (recreated to match Word document spec)
--   - user_audit_log (recreated to match Word document spec)
-- 
-- Users table modified:
--   - auth_provider ENUM('EMAIL', 'GOOGLE')
--   - password_changed_at DATETIME
-- ================================
