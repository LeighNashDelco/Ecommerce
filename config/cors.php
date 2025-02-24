<?php

return [
    'paths' => ['api/*'], // Ensure your API endpoints allow CORS
    'allowed_methods' => ['*'], 
    'allowed_origins' => ['http://localhost:8000', 'http://127.0.0.1:8000'], // Add both origins
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Allow credentials (cookies, authorization headers)
];
