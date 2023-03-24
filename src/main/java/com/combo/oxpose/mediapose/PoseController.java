package com.combo.oxpose.mediapose;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PoseController {
	
	@Autowired
	private PoseService poseService;
	
	@GetMapping("/")
	public ModelAndView Home() {
		
		ModelAndView mv = new ModelAndView();
		ArrayList<String> fileNames = poseService.getFileNum();
		
		mv.addObject("fileNames", fileNames);
		mv.setViewName("index");
		
		
		return mv;
	}
	
	
	
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
	
	@ResponseBody
	@PostMapping("/setAnalyzePose")
	public double setAnalyzePose(@RequestBody List<Map<String, Object>> data, Model model) {
		return poseService.setAnalyzePose(data);
	}

}
