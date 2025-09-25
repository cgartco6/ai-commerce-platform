-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    subscription_tier VARCHAR(50) DEFAULT 'starter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    description TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    compare_price DECIMAL(10,2),
    sku VARCHAR(100),
    inventory_quantity INTEGER DEFAULT 0,
    ai_generated BOOLEAN DEFAULT FALSE,
    seo_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketing campaigns table
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'google', 'instagram', etc.
    budget DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'draft',
    target_audience JSONB DEFAULT '{}',
    creative_assets JSONB DEFAULT '{}',
    ai_optimized BOOLEAN DEFAULT TRUE,
    performance_metrics JSONB DEFAULT '{}',
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI model training sessions
CREATE TABLE ai_training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    model_type VARCHAR(100) NOT NULL, -- 'content_generation', 'recommendation', etc.
    training_data JSONB DEFAULT '{}',
    hyperparameters JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'training',
    accuracy_metrics JSONB DEFAULT '{}',
    model_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Compliance checks table
CREATE TABLE compliance_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL, -- 'south_africa', 'namibia', 'botswana', 'gdpr'
    check_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    requirements JSONB DEFAULT '{}',
    issues_found JSONB DEFAULT '[]',
    passed BOOLEAN DEFAULT FALSE,
    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_check TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_campaigns_store_id ON marketing_campaigns(store_id);
CREATE INDEX idx_compliance_store_id ON compliance_checks(store_id);
CREATE INDEX idx_training_user_id ON ai_training_sessions(user_id);
