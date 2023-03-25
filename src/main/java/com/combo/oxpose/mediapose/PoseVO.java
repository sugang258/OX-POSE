package com.combo.oxpose.mediapose;

import lombok.Data;

@Data
public class PoseVO {
	
	private Integer frame;
	private Integer keyPoint;
	private double x;
	private double y;
	private double z;
	private double visibility;
	private double theta;
}
