package com.combo.oxpose.mediapose;

import java.io.File;
import java.math.MathContext;
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
			poseVO.setPoint(i);
			poseVO.setX(Double.valueOf(data.get(i).get("x").toString()));
			poseVO.setY(Double.valueOf(data.get(i).get("y").toString()));
			poseVO.setZ(Double.valueOf(data.get(i).get("z").toString()));
			poseVO.setVisibility(Double.valueOf(data.get(i).get("visibility").toString()));
						
			list.add(poseVO);
		}
		num++;
		result.add(list);
		cos(CalVector(12,11), CalVector(12,14));
//		log.info("result :    " + result.size());
//		log.info("result :     " + result);

		return;
	}
	
	public double[] CalVector(int a, int b) {
		
		double[] vector = new double[3];
		double x1,y1,z1;
		double x2,y2,z2;
		double unit;
		
		for(int j=0;j<result.size();j++) {
			List<PoseVO> one = result.get(j);
			vector = new double[3];
			
			x1=0; y1=0; z1=0;
			x2=0; y2=0; z2=0;
			unit = 0;
			
			for(int i=0;i<one.size();i++) {
				
				if(one.get(i).getPoint() == a) {
					PoseVO poseVO = one.get(i);
					unit = Math.sqrt(Math.pow(poseVO.getX(), 2)+ Math.pow(poseVO.getY(), 2)+ Math.pow(poseVO.getZ(), 2));
					x1 = Math.abs(poseVO.getX()/unit);
					y1 = Math.abs(poseVO.getY()/unit);
					z1 = Math.abs(poseVO.getZ()/unit);
					
				}
				
				if(one.get(i).getPoint() == b) {
					PoseVO poseVO = one.get(i);
					unit = Math.sqrt(Math.pow(poseVO.getX(), 2)+ Math.pow(poseVO.getY(), 2)+ Math.pow(poseVO.getZ(), 2));
					x2 = Math.abs(poseVO.getX()/unit);
					y2 = Math.abs(poseVO.getY()/unit);
					z2 = Math.abs(poseVO.getZ()/unit);
				}
				
			}
			
			vector[0] = x2 - x1;
			vector[1] = y2 - y1;
			vector[2] = z2 - z1;
			
		}
		return vector;
		
	}
	
	public void cos(double[] a, double[] b) {
		
		double numer = a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; //분자
		double deno1 = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2],2));
		double deno2 = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2) + Math.pow(b[2], 2));
		
		double deno = deno1 * deno2;
		double ceta = Math.acos(numer/deno);
		
		System.out.println("ceta :    "+ceta*100);
		
					
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
//		log.info("files :  " + files);
		for (int i = 0; i < files.length; i++) {
			File file = files[i];
			fileNames.add(file.getName());
			
//			log.info("file :  " + file);
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
