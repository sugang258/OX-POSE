package com.combo.oxpose.mediapose;

import java.io.File;
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
		for (int i = 0; i < data.size(); i++) {
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
		result();
//		log.info("result :    " + result.size());
		
		return;
	}

	public void result() {

		double[] vector1 = new double[3];
		double[] vector2 = new double[3];

		// 전체 좌표 (하나씩 추가됨)
//		for(int i=0;i<result.size();i++) {
//			vector1 = calVector(12, 11,result.get(i));
//			vector2 = calVector(12, 14,result.get(i));
//			
//			System.out.println(calCeta(vector1, vector2)*100);
//		}

		// 추가되는 좌표 (마지막 거)
		vector1 = calVector(12, 11, result.get(result.size() - 1));
		vector2 = calVector(12, 14, result.get(result.size() - 1));

		System.out.println(calCeta(vector1, vector2) * 100);
	}

	public double calCeta(double[] a, double[] b) {

		double numer = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; // 분자
		double deno1 = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2));
		double deno2 = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2) + Math.pow(b[2], 2));

		double deno = deno1 * deno2;

		return Math.acos(numer / deno);

	}

	public double[] calVector(int a, int b, List<PoseVO> one) {

		double[] vector = new double[3];
		double x1 = 0, y1 = 0, z1 = 0;
		double x2 = 0, y2 = 0, z2 = 0;
		double unit = 0;

		for (int i = 0; i < one.size(); i++) {

			vector = new double[3];

			if (one.get(i).getPoint() == a) {
				PoseVO poseVO1 = one.get(i);
				unit = vectorSize(poseVO1);
				x1 = unitVector(poseVO1.getX(), unit);
				y1 = unitVector(poseVO1.getY(), unit);
				z1 = unitVector(poseVO1.getZ(), unit);
			}

			if (one.get(i).getPoint() == b) {
				PoseVO poseVO2 = one.get(i);
				unit = vectorSize(poseVO2);
				x2 = Math.abs(poseVO2.getX() / unit);
				y2 = Math.abs(poseVO2.getY() / unit);
				z2 = Math.abs(poseVO2.getZ() / unit);
			}
		}

		vector[0] = x2 - x1;
		vector[1] = y2 - y1;
		vector[2] = z2 - z1;
		
		return vector;
	}

	public double vectorSize(PoseVO poseVO) {
		return Math.sqrt(Math.pow(poseVO.getX(), 2) + Math.pow(poseVO.getY(), 2) + Math.pow(poseVO.getZ(), 2));
	}

	public double unitVector(double coordinate, double unit) {
		return Math.abs(coordinate / unit);
	}

	public ArrayList<String> getFileNum() {
		try {
			String path = "src/main/resources/static/video/";// System.getProperty("user.dir");

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
				// System.out.println("[File]" + file.getCanonicalPath().toString());
				// System.out.println("[Directory CNT]" + file.getCanonicalPath().toString()+" "
				// +fileCnt);

			} else if (file.isDirectory()) {
				dirCnt++;
				// System.out.println("[Directory]" + file.getCanonicalPath().toString());
				try {
					showFileList(file.getCanonicalPath().toString());
				} catch (Exception e) {
				}
			}
		}
//		log.info("route :  " + dir.getCanonicalPath().toString());
//		log.info("file :  " + fileCnt);
//		log.info("dirCnt :  " + dirCnt);
		return fileNames;
	}
}