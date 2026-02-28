# Setting up IntelliJ to run Features from the IDE

## Setup Configuration Template

1. Open **Run > Edit Configurations...**
2. Select your Cucumber.js configuration
3. In the **Environment variables** field, add:
   ```
   NODE_OPTIONS=--import tsx
   ```
4. Apply and re-run
