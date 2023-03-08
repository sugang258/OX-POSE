package com.combo.oxpose.mediapose;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PoseController {
	
	@GetMapping("/live")
	public String live() {
		return "mediapipe_live";
	}
	
	@GetMapping("/pose")
	public String pose() {
		return "mediapipe_video";
	}
	
	@GetMapping("/multi")
	public String multi() {
		return "mediapipe_multi";
	}
	
	@GetMapping("/multiVideo")
	public String multiVideo() {
		return "mediapipe_multiVideo";
	}

}
