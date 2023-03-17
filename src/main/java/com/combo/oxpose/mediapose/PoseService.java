package com.combo.oxpose.mediapose;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
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
						
			list.add(poseVO);
		}
		num++;
		result.add(list);
		log.info("result :    " + result.size());
		log.info("result :     " + result);

		return;
	}
	
	
	public ArrayList<String> getFileNum() {
		try {			
			String path = "src/main/resources/static/video/";//System.getProperty("user.dir");
			
			return showFileList(path);

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		return null;
	}
	public ArrayList<String> showFileList(String path) throws Exception {
		File dir = new File(path);
		File[] files = dir.listFiles();
		
		ArrayList<String> fileNames = new ArrayList<>();
		
		int fileCnt = 0;		
		int dirCnt = 0;
		log.info("files :  " + files);
		for (int i = 0; i < files.length; i++) {
			File file = files[i];
			fileNames.add(file.getName());
			
			log.info("file :  " + file);
			if (file.isFile()) {
				fileCnt++;// 파일 개수 				
				//System.out.println("[File]" + file.getCanonicalPath().toString());				
				//System.out.println("[Directory CNT]" + file.getCanonicalPath().toString()+"  " +fileCnt);
				
			} else if (file.isDirectory()) {
				dirCnt++;
				//System.out.println("[Directory]" + file.getCanonicalPath().toString());
				try {
					showFileList(file.getCanonicalPath().toString());
				} catch (Exception e) {
				}
			}
		}		
		log.info("route :  " + dir.getCanonicalPath().toString());
		log.info("file :  " + fileCnt);
		log.info("dirCnt :  " + dirCnt);
		return fileNames;
	}
}
