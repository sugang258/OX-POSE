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

	public double posePrint(List<Map<String, Object>> data) {
		
		newAxisNormalization(data);
	
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

		return result();
	}
	
	
	/**
	 * 데이터를 신체 기준의 새로운 축을 기준으로 정규화하는 함수
	 * 좌어깨 : 11 / 우어깨 : 12
	 * 좌엉 : 23 / 우엉 : 24
	 */
	public void newAxisNormalization(List<Map<String, Object>> data) {
		
		// 어깨 중앙선과 엉덩이 중앙선을 구합니다.
		double[] shoulderCenter = {
		    (Double.valueOf(data.get(11).get("x").toString()) + Double.valueOf(data.get(12).get("x").toString())) / 2,
		    (Double.valueOf(data.get(11).get("y").toString()) + Double.valueOf(data.get(12).get("y").toString())) / 2,
		    (Double.valueOf(data.get(11).get("z").toString()) + Double.valueOf(data.get(12).get("z").toString())) / 2
		};
		double[] hipCenter = {
		    (Double.valueOf(data.get(23).get("x").toString()) + Double.valueOf(data.get(24).get("x").toString())) / 2,
		    (Double.valueOf(data.get(23).get("y").toString()) + Double.valueOf(data.get(24).get("y").toString())) / 2,
		    (Double.valueOf(data.get(23).get("z").toString()) + Double.valueOf(data.get(24).get("z").toString())) / 2
		};

		// 옆구리 중앙선을 구합니다.
		double[] leftSideCenter = {
		    (Double.valueOf(data.get(11).get("x").toString()) + Double.valueOf(data.get(23).get("x").toString())) / 2,
		    (Double.valueOf(data.get(11).get("y").toString()) + Double.valueOf(data.get(23).get("y").toString())) / 2,
		    (Double.valueOf(data.get(11).get("z").toString()) + Double.valueOf(data.get(23).get("z").toString())) / 2
		};
		double[] rightSideCenter = {
		    (Double.valueOf(data.get(12).get("x").toString()) + Double.valueOf(data.get(24).get("x").toString())) / 2,
		    (Double.valueOf(data.get(12).get("y").toString()) + Double.valueOf(data.get(24).get("y").toString())) / 2,
		    (Double.valueOf(data.get(12).get("z").toString()) + Double.valueOf(data.get(24).get("z").toString())) / 2
		};

		// 어깨 중앙선과 엉덩이 중앙선을 기준으로 하는 새로운 Y축을 계산합니다.
		double[] yAxis = {hipCenter[0] - shoulderCenter[0], hipCenter[1] - shoulderCenter[1], hipCenter[2] - shoulderCenter[2]};
		double yAxisLength = vectorSize(yAxis);
		yAxis[0] /= yAxisLength;
		yAxis[1] /= yAxisLength;
		yAxis[2] /= yAxisLength;
		
		double[] leftToRight = {rightSideCenter[0] - leftSideCenter[0], rightSideCenter[1] - leftSideCenter[1], rightSideCenter[2] - leftSideCenter[2]};
		double[] zAxis = crossProduct(leftToRight, yAxis);
		double zAxisLength = vectorSize(zAxis);
		zAxis[0] /= zAxisLength;
		zAxis[1] /= zAxisLength;
		zAxis[2] /= zAxisLength;
		
		double[] xAxis = crossProduct(zAxis, yAxis);
		double xAxisLength = vectorSize(xAxis);
		xAxis[0] /= xAxisLength;
		xAxis[1] /= xAxisLength;
		xAxis[2] /= xAxisLength;
		
		int key= 20;
		double[] point = {Double.valueOf(data.get(key).get("x").toString()),Double.valueOf(data.get(key).get("y").toString()),Double.valueOf(data.get(key).get("z").toString())};
		double x = dotProduct(xAxis, point);
		double y = dotProduct(yAxis, point);
		double z = dotProduct(zAxis, point);
		
		System.out.print("x = " + x);
		System.out.print("/  y = " + y);
		System.out.println("/  z = " + z);
     }
	
	/** 
	 * 벡터의 내적 
	 */
	public static double dotProduct(double[] v1, double[] v2) {
	    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
	}
	
	
	/**
	 * 벡터의 외적
	 * @return : 벡터 a, 벡터 b와 수직인 벡터
	 */
	public static double[] crossProduct(double[] a, double[] b) {
	    double[] result = new double[3];
	    result[0] = a[1] * b[2] - a[2] * b[1];
	    result[1] = a[2] * b[0] - a[0] * b[2];
	    result[2] = a[0] * b[1] - a[1] * b[0];
	    return result;
	}


	public double result() {

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
		// 왼쪽 어꺠 - 오른쪽 어깨 - 오른쪽 팔꿈치
//		vector1 = calVector(12, 11, result.get(result.size() - 1));
//		vector2 = calVector(12, 14, result.get(result.size() - 1));
		
		// 오른쪽 무릎
//		vector1 = calVector(26, 24, result.get(result.size() - 1));
//		vector2 = calVector(26, 28, result.get(result.size() - 1));

		// 오른쪽 팔꿈치
		vector1 = calVector(14, 12, result.get(result.size() - 1));
		vector2 = calVector(14, 16, result.get(result.size() - 1));
		
//		System.out.println("각도 " + calCeta(vector1, vector2));
		return calCeta(vector1, vector2);
	}

	// 결과 단위 : 라디안
	// 라디안 x 180 / 파이 = 도
	public double calCeta(double[] a, double[] b) {

		double numer = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; // 분자
		double deno1 = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2));
		double deno2 = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2) + Math.pow(b[2], 2));

		double deno = deno1 * deno2;

		return Math.acos(numer / deno)* 180 / Math.PI;

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
				x1 = poseVO1.getX();
				y1 = poseVO1.getY();
				z1 = poseVO1.getZ();
			}

			if (one.get(i).getPoint() == b) {
				PoseVO poseVO2 = one.get(i);
				x2 = poseVO2.getX();
				y2 = poseVO2.getY();
				z2 = poseVO2.getZ();
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
	public double vectorSize(double[] vector) {
		return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
	}

	public double unitVector(double coordinate, double unit) {
		return Math.abs(coordinate / unit);
	}

	
	/**
	 * JS 상에서 resource/static/video 의 파일 갯수를 가져다 주는 함수
	 * 현재는 DB연결 전에 사용하려고 작성하였지만, 더는 사용하지 않는다.
	*/
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