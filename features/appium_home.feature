Feature: Appium Documentation Home

  Background:
    Given the "User" opens the url "https://appium.io/docs/en/latest/"

  Scenario: Verify Appium docs home loads
    Then the page title should contain "Appium"
    Then the url should contain "docs/en/latest/"
