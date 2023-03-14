package com.combo.oxpose.mediapose;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.extern.java.Log;

@Service
@Log
public class PoseService {
	
	private List<List<PoseVO>> result = new ArrayList<>();
	private List<PoseVO> list = new ArrayList<>();
	private int num = 1;
	
	public void posePrint(List<Map<String, Object>> data) {
		
		list = new ArrayList<>();
		for(int i=0;i<data.size();i++) {
			PoseVO poseVO = new PoseVO();
			poseVO.setNum(num);
			poseVO.setPoint(i+1);
			poseVO.setX(Double.valueOf(data.get(i).get("x").toString()));
			poseVO.setY(Double.valueOf(data.get(i).get("y").toString()));
			poseVO.setVisibility(Double.valueOf(data.get(i).get("visibility").toString()));
						
			result.get(i).add(poseVO);
//			list.add(poseVO);
		}
		num++;
		result.add(list);
		log.info("result :    " + result.size());
		log.info("result :     " + result);

		return;
	}

}
