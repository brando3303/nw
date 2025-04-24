# Makefile

# Load env variables from .env file
ifneq (,$(wildcard .env))
  include .env
  export $(shell sed 's/=.*//' .env)
endif

# Directory for build outputs. use win, macos, or linux.
BUILD_DIR=builds
DEVICE=win

# Build target
all:
	# Make sure builds/ exists
	mkdir -p $(BUILD_DIR)

	# Clean old artifacts inside builds/
	@if ls $(BUILD_DIR)/update.* 1> /dev/null 2>&1; then rm $(BUILD_DIR)/update.*; fi

	# Build with esbuild, outputting update.js into builds/
	npx esbuild index.js --bundle \
		--define:process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING='"$(NOTION_API_KEY_NATE_LELAND_SCOUTING)"' \
		--define:process.env.VERCEL_POSTGRES_DB_URL='"$(VERCEL_POSTGRES_DB_URL)"' \
		--outfile=$(BUILD_DIR)/update.js \
		--platform=node

	# Package into an executable inside builds/
	npx pkg -t node20-$(DEVICE)-x64 $(BUILD_DIR)/update.js --output $(BUILD_DIR)/update-$(DEVICE)-x64

	#allow mac exe to be executed
	chmod +x $(BUILD_DIR)/update-$(DEVICE)-x64*
