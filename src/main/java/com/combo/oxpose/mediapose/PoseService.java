package com.combo.oxpose.mediapose;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PoseService {

	private List<List<PoseVO>> allPoseData = new ArrayList<>();
	private List<PoseVO> onePoseData = new ArrayList<>();

	private int frame = 1;

	private final int[][] joints = { { 11, 12, 13 }, { 12, 11, 14 }, { 13, 11, 15 }, { 14, 12, 16 }, { 23, 24, 25 },
			{ 24, 23, 26 }, { 25, 23, 27 }, { 26, 24, 28 } };

	/**
	 * 포즈의 키 포인트 데이터를 정규화, 각 관절의 각도를 구하는 함수
	 * 
	 * @param data : 분석 결과
	 * @return (임시)
	 */
	public double setAnalyzePose(List<Map<String, Object>> data) {

		normalizeData(data);

		onePoseData = new ArrayList<>();
		for (int keyPoint = 0; keyPoint < data.size(); keyPoint++) {
			PoseVO poseVO = new PoseVO();
			poseVO.setFrame(frame);
			poseVO.setKeyPoint(keyPoint);
			poseVO.setX(Double.valueOf(data.get(keyPoint).get("x").toString()));
			poseVO.setY(Double.valueOf(data.get(keyPoint).get("y").toString()));
			poseVO.setZ(Double.valueOf(data.get(keyPoint).get("z").toString()));
			poseVO.setVisibility(Double.valueOf(data.get(keyPoint).get("visibility").toString()));

			onePoseData.add(poseVO);
		}

		for (int[] joint : joints) {
			onePoseData.get(joint[0]).setTheta(getTheta(joint[0], joint[1], joint[2]));
		}

		allPoseData.add(onePoseData);
		frame++;

		return getTheta(26, 24, 28); // 임시
	}

	/**
	 * 데이터를 신체 기준의 새로운 축을 기준으로 정규화하는 함수 좌어깨 : 11 / 우어깨 : 12 / 좌엉 : 23 / 우엉 : 24
	 */
	public void normalizeData(List<Map<String, Object>> data) {

		// 어깨 중앙선과 엉덩이 중앙선을 구합니다.
		double[] shoulderCenter = {
				(Double.valueOf(data.get(11).get("x").toString()) + Double.valueOf(data.get(12).get("x").toString()))
						/ 2,
				(Double.valueOf(data.get(11).get("y").toString()) + Double.valueOf(data.get(12).get("y").toString()))
						/ 2,
				(Double.valueOf(data.get(11).get("z").toString()) + Double.valueOf(data.get(12).get("z").toString()))
						/ 2 };
		double[] hipCenter = {
				(Double.valueOf(data.get(23).get("x").toString()) + Double.valueOf(data.get(24).get("x").toString()))
						/ 2,
				(Double.valueOf(data.get(23).get("y").toString()) + Double.valueOf(data.get(24).get("y").toString()))
						/ 2,
				(Double.valueOf(data.get(23).get("z").toString()) + Double.valueOf(data.get(24).get("z").toString()))
						/ 2 };

		// 옆구리 중앙선을 구합니다.
		double[] leftSideCenter = {
				(Double.valueOf(data.get(11).get("x").toString()) + Double.valueOf(data.get(23).get("x").toString()))
						/ 2,
				(Double.valueOf(data.get(11).get("y").toString()) + Double.valueOf(data.get(23).get("y").toString()))
						/ 2,
				(Double.valueOf(data.get(11).get("z").toString()) + Double.valueOf(data.get(23).get("z").toString()))
						/ 2 };
		double[] rightSideCenter = {
				(Double.valueOf(data.get(12).get("x").toString()) + Double.valueOf(data.get(24).get("x").toString()))
						/ 2,
				(Double.valueOf(data.get(12).get("y").toString()) + Double.valueOf(data.get(24).get("y").toString()))
						/ 2,
				(Double.valueOf(data.get(12).get("z").toString()) + Double.valueOf(data.get(24).get("z").toString()))
						/ 2 };

		// 어깨 중앙선과 엉덩이 중앙선을 기준으로 하는 새로운 Y축을 계산합니다.
		double[] yAxis = { hipCenter[0] - shoulderCenter[0], hipCenter[1] - shoulderCenter[1],
				hipCenter[2] - shoulderCenter[2] };
		yAxis = normalize(yAxis);

		double[] leftToRight = { rightSideCenter[0] - leftSideCenter[0], rightSideCenter[1] - leftSideCenter[1],
				rightSideCenter[2] - leftSideCenter[2] };
		double[] zAxis = crossProduct(leftToRight, yAxis);
		zAxis = normalize(zAxis);

		double[] xAxis = crossProduct(zAxis, yAxis);
		xAxis = normalize(xAxis);

		for (Map<String, Object> keyPoint : data) {

			double[] point = { Double.valueOf(keyPoint.get("x").toString()),
					Double.valueOf(keyPoint.get("y").toString()), Double.valueOf(keyPoint.get("z").toString()) };

			keyPoint.put("x", dotProduct(xAxis, point));
			keyPoint.put("y", dotProduct(yAxis, point));
			keyPoint.put("z", dotProduct(zAxis, point));
		}
	}

	/**
	 * 벡터를 단위 벡터로 정규화 하는 함수
	 * 
	 * @param v
	 * @return
	 */
	public double[] normalize(double[] v) {
		double[] unitVector = new double[3];
		double magnitude = vectorSize(v);

		if (magnitude > 0) {
			unitVector[0] = v[0] / magnitude;
			unitVector[1] = v[1] / magnitude;
			unitVector[2] = v[2] / magnitude;
		}
		return unitVector;
	}

	/**
	 * 벡터의 내적
	 */
	public static double dotProduct(double[] v1, double[] v2) {
		return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
	}

	/**
	 * 벡터의 외적
	 * 
	 * @return : 벡터 v1,v2와 수직인 벡터
	 */
	public static double[] crossProduct(double[] v1, double[] v2) {
		double[] verticalVector = new double[3];
		verticalVector[0] = v1[1] * v2[2] - v1[2] * v2[1];
		verticalVector[1] = v1[2] * v2[0] - v1[0] * v2[2];
		verticalVector[2] = v1[0] * v2[1] - v1[1] * v2[0];
		return verticalVector;
	}

	/**
	 * 관절의 각도를 구하는 함수
	 * 
	 * @param pointKey : 관절 중앙
	 * @param sideKey1 : pointKey 주위 key1
	 * @param sideKey2 : pointKey 주위 key2
	 * @return (pointKey -> sideKey1 , pointKey -> sideKey2) 사이 각
	 */
	public double getTheta(int pointKey, int sideKey1, int sideKey2) {

		double[] vector1 = new double[3];
		double[] vector2 = new double[3];

		vector1 = calVector(pointKey, sideKey1, onePoseData);
		vector2 = calVector(pointKey, sideKey2, onePoseData);

		return calTheta(vector1, vector2);
	}

	/**
	 * 두 벡터 사이의 각도를 구하는 함수
	 * 
	 * @return (degree) v1, v2 사이 각
	 */
	public double calTheta(double[] v1, double[] v2) {

		double cosTheta = dotProduct(v1, v2) / (vectorSize(v1) * vectorSize(v2));

		return Math.acos(cosTheta) * 180 / Math.PI;
	}

	/**
	 * 두 키 포인트 사이의 벡터를 구하는 함수
	 * 
	 * @return vector (v1 -> v2)
	 */
	public double[] calVector(int key1, int key2, List<PoseVO> onePoseData) {

		double[] vector = new double[3];
		PoseVO poseVO1 = onePoseData.get(key1);
		PoseVO poseVO2 = onePoseData.get(key2);

		vector[0] = poseVO2.getX() - poseVO1.getX();
		vector[1] = poseVO2.getY() - poseVO1.getY();
		vector[2] = poseVO2.getZ() - poseVO1.getZ();

		return vector;
	}

	/**
	 * 벡터의 크기를 구하는 함수
	 * 
	 * @return 벡터 크기
	 */

	public double vectorSize(PoseVO poseVO) {
		return Math.sqrt(Math.pow(poseVO.getX(), 2) + Math.pow(poseVO.getY(), 2) + Math.pow(poseVO.getZ(), 2));
	}

	public double vectorSize(double[] vector) {
		return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
	}

	/**
	 * JS 상에서 resource/static/video 의 파일 갯수를 가져다 주는 함수 현재는 DB연결 전에 사용하려고 작성하였지만, 더는
	 * 사용하지 않는다.
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