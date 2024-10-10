// Copyright Epic Games, Inc. All Rights Reserved.

import { Config, Flags, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.4';
import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.4';
const PixelStreamingApplicationStyles =
    new PixelStreamingApplicationStyle();
PixelStreamingApplicationStyles.applyStyleSheet();

// expose the pixel streaming object for hooking into. tests etc.
declare global {
    interface Window { pixelStreaming: PixelStreaming; }
}

document.body.onload = function() {
	// Example of how to set the logger level
	// Logger.SetLoggerVerbosity(10);

	// Create a config object
	const config = new Config({ useUrlParams: true });
	config.setFlagEnabled(Flags.MatchViewportResolution, false);
	config.setFlagEnabled(Flags.HoveringMouseMode, true);

	// Create a Native DOM delegate instance that implements the Delegate interface class
	const stream = new PixelStreaming(config);

	const application = new Application({
		stream,
		onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode)
	});
	// document.getElementById("centrebox").appendChild(application.rootElement);
	document.body.appendChild(application.rootElement);
	
	window.pixelStreaming = stream;

	stream.addResponseEventListener("handle_responses", (response: string) => {
		console.log("Message Received");
		console.log(response);
		
		try {
			const jsonResponse = JSON.parse(response);
			console.log("Parsed JSON Object:", jsonResponse);
	
			// Check for the 'action' field
			switch (jsonResponse.action) {
				case "mouseOn":
					console.log("Mouse is ON");
					// Add your logic for mouseOn here
					config.setFlagEnabled(Flags.HoveringMouseMode, true);
					break;
	
				case "mouseOff":
					console.log("Mouse is OFF");
					
					// Simulate a mouse click on the video element
					config.setFlagEnabled(Flags.HoveringMouseMode, false);
					const videoElement = document.getElementById('streamingVideo');
					if (videoElement) {
						const clickEvent = new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
							view: window
						});
						videoElement.dispatchEvent(clickEvent);
						console.log("Simulated a mouse click on the video element.");
					} else {
						console.warn("Video element not found.");
					}
				
					break;
	
				default:
					console.warn("Unknown action:", jsonResponse.action);
					break;
			}
	
		} catch (error) {
			console.error("Failed to parse JSON response:", error);
		}
	});
	

}

