package com.combo.oxpose.mediapose;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PoseController {
	
	@GetMapping("/pose")
	public String pose() {
		return "mediapipe_video";
	}

}
