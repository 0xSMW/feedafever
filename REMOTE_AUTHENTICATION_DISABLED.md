# Remote Authentication Disabled

Since http://feedafever.com is no longer available, the following remote authentication and update features have been disabled:

## Changes Made

### 1. boot.php
- Commented out `SOURCES_URL` definition
- Disabled `remote_copy()` of firewall.php from remote server
- Added fallback code to create basic index.php

### 2. safety-reboot.php  
- Disabled remote copying of pclzip.lib.php and apptivator.zip
- Added error message explaining manual installation is required

### 3. safety-unlace.php
- Disabled remote copying of unlace.php
- Added error message explaining manual operation required

### 4. firewall/app/libs/fever.php
- **`check_for_updates()`** - Disabled completely, returns immediately
- **`update_files()`** - Disabled completely, returns immediately  
- **`update_available()`** - Always returns false
- **`gateway_request()`** - Returns fake successful response with `X-Apptivator-Verified: true`

## Impact

- **License verification**: Bypassed - the application will no longer check for valid license keys
- **Auto-updates**: Disabled - the application will not try to update itself from the remote server
- **Manual updates**: Disabled - update functionality will not work
- **Installation**: May require manual setup of firewall application files

## What Still Works

- All core RSS feed reading functionality
- Local feed management
- User authentication and sessions
- Feed parsing and caching
- All reader interface features

## Manual Installation

If the firewall application files are missing, you'll need to manually place them in the `firewall/app/` directory. The existing codebase suggests this should contain the main Fever application.

The original Fever was a commercial product, so respect the original licensing terms when using this code. 