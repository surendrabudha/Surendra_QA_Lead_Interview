Preconditions: 

The Activity Ranking API service is deployed and accessible.

A stable internet connection is available.

The Open-Meteo APIs are accessible and returning valid weather data. 

The application's front-end (if applicable for search box UI) is accessible.

A predefined or dynamic list of cities is available for autocomplete suggestions. 


Test Steps & Expected Results: 


Test Case 1.1: Valid City Input - Happy Path with Autocomplete Suggestion Selection 

Purpose: To verify that entering a valid city, selecting a suggestion, and triggering the request returns correctly ranked activities based on weather.

Steps:

Navigate to the application interface containing the search box.

Start typing a city name, e.g., "Lon".


Expected Result: Autocomplete suggestions should appear below the search box, including "London". 


Select "London" from the suggestions.


Expected Result: The search box should populate with "London", and the activity ranking request should be triggered automatically. 

Observe the displayed results.


Expected Result: A ranked list of activities (Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing) for London for the next 7 days should be displayed. Each entry should include Date, Activity name, Rank (1-10), and Reasoning.  The rankings should align logically with typical weather conditions for London over the next 7 days (e.g., higher Indoor Sightseeing rank if rainy, higher Outdoor Sightseeing if clear).


Test Case 1.2: Valid City Input - Happy Path without Autocomplete Selection

Purpose: To verify that manually entering a valid city and triggering the request returns correctly ranked activities.

Steps:

Navigate to the application interface containing the search box.

Type a complete valid city name, e.g., "Paris".

Press Enter or click a "Search" button (if available).

Expected Result: A ranked list of activities for Paris for the next 7 days should be displayed. Each entry should include Date, Activity name, Rank (1-10), and Reasoning.  The rankings should align logically with typical weather conditions for Paris over the next 7 days.


Test Case 1.3: Invalid City Input 

Purpose: To verify the system's behavior when an invalid or non-existent city name is provided.

Steps:

Navigate to the application interface containing the search box.

Type an invalid city name, e.g., "XyzzyTown".

Press Enter or click a "Search" button.

Expected Result: An appropriate error message should be displayed (e.g., "City not found," "Please enter a valid city"). No activity ranking results should be shown.


Test Case 1.4: No Autocomplete Suggestions Returned 


Purpose: To verify the autocomplete behavior when no matching suggestions are available.

Steps:

Navigate to the application interface containing the search box.

Start typing a string that has no matching cities in the predefined/dynamic list, e.g., "Qwert".

Expected Result: No autocomplete suggestions should appear below the search box.

Test Case 1.5: Empty Search Input

Purpose: To verify the system's behavior when the search input is empty.

Steps:

Navigate to the application interface containing the search box.

Ensure the search box is empty.

Attempt to trigger a search (e.g., by pressing Enter on an empty search box or clicking an empty search button).

Expected Result: An appropriate message should be displayed (e.g., "Please enter a city name"). No activity ranking results should be shown.


Test Case 1.6: Slow API Response / Timeout 

Purpose: To verify user experience when the Activity Ranking API response is delayed or times out.

Steps:

(Simulate slow API response or configure a proxy to introduce delay, or if there's a specific test environment to mimic this scenario).

Enter a valid city name, e.g., "Berlin".

Trigger the activity ranking request.

Expected Result: A loading indicator or message should be displayed to the user. After a predefined timeout, an appropriate error message should appear (e.g., "Service temporarily unavailable," "Request timed out").


Test Case 1.7: Open-Meteo API Failure 

Purpose: To verify the system's error handling when the external weather API (Open-Meteo) fails.

Steps:

(Simulate Open-Meteo API failure, e.g., by blocking its access or configuring a mock to return errors).

Enter a valid city name, e.g., "Tokyo".

Trigger the activity ranking request.

Expected Result: An appropriate error message should be displayed to the user (e.g., "Unable to fetch weather data," "An internal error occurred"). No activity ranking results should be shown.

Test Case 1.8: Activity Ranking Logic Verification (Specific Weather Scenarios)

Purpose: To verify the accuracy of the ranking logic based on specific weather conditions.

Steps:

Identify a city and a date in the next 7 days for which specific weather conditions are expected (e.g., high snowfall for Skiing, clear skies and warm temperatures for Outdoor Sightseeing, heavy rain for Indoor Sightseeing). This might require checking actual weather forecasts or using a test environment with controllable weather data.

Enter the city name and trigger the request.

Expected Result: For the identified date, the activities should be ranked appropriately based on the simulated/actual weather conditions. For example, if heavy snowfall is expected, Skiing should have a high rank and Surfing/Outdoor Sightseeing a low rank, with appropriate reasoning.