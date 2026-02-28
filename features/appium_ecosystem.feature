Feature: Appium Ecosystem Tools

  Background:
    Given the "User" opens the url "https://appium.io/docs/en/2.4/ecosystem/tools/"

  Scenario: Verify Appium ecosystem tools page
    Then the page title should contain "Appium"
    Then the url should contain "ecosystem/tools"

  Scenario: Verify Appium ecosystem tools page again
    Then the page title should contain "Appium"
    Then the url should contain "ecosystem/tools"