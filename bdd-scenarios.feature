Feature: Activity Ranking API - City-Based Weather Forecast Integration

  As a user, I want to enter a city or town name and receive a ranked list of activities for the next 7 days, based on weather conditions. 
  As I type in the search box, I should also see autocomplete suggestions for matching cities or towns. [cite: 12]

  Scenario: Successfully retrieve activity rankings for a valid city with autocomplete
    Given the application is accessible
    And the search box is visible
    When I type "Lon" into the search box
    Then I should see "London" in the autocomplete suggestions [cite: 22]
    When I select "London" from the suggestions 
    Then the activity ranking request should be sent for "London"
    And I should receive a successful response
    And the response should contain activity rankings for the next 7 days 
    And each ranking should include "Date", "Activity name", "Rank (1-10)", and "Reasoning" 
    And "Skiing" should be ranked high if "High snowfall expected" is the reasoning
    And "Outdoor Sightseeing" should be ranked high if "Clear skies and 22°C" is the reasoning

  Scenario: No autocomplete suggestions returned for an unknown input
    Given the application is accessible
    And the search box is visible
    When I type "Zzxxyy" into the search box
    Then I should not see any autocomplete suggestions [cite: 37]
    And the activity ranking request should not be sent

  Scenario: Handle API failure when fetching weather data
    Given the application is accessible
    And the Open-Meteo API is configured to return an error [cite: 15, 38]
    When I enter "Sydney" into the search box
    And I trigger the activity ranking request
    Then I should receive an error response
    And an error message indicating weather data unavailability should be displayed
    And no activity rankings should be shown