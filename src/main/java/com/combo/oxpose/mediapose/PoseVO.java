package com.combo.oxpose.mediapose;

import java.util.ArrayList;

import lombok.Data;

@Data
public class PoseVO {
	
	private Integer frame;
	private double time;
	private ArrayList<PoseKeyPoint> poseLandmarks;
	private ArrayList<PoseKeyPoint> poseWorldLandmarks; // 33개
	private ArrayList<PoseTheta> poseTheta; // 12개
	
	
	@Data
	public class PoseKeyPoint{
		private double x;
		private double y;
		private double z;
		private double visibility;
	}
	
	@Data
	public class PoseTheta{
		private Integer keyPoint;
		private double theta;
	}
}