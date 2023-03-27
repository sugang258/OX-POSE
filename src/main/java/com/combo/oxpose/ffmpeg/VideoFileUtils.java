package com.combo.oxpose.ffmpeg;

import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import net.bramp.ffmpeg.probe.FFmpegFormat;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Slf4j
@Component
public class VideoFileUtils {

	@Value("${ffmpeg.location}")
	private String ffmpegPath;
	@Value("${ffprobe.location}")
	private String ffprobePath;

	public String media_player_time(MultipartFile file) {
		String returnData = "0";

		if (file.isEmpty()) {
			return "";
		}

		try {
			String filePath = "C:/temp/test.mp4";
			file.transferTo(new File(filePath));

			FFprobe ffprobe = new FFprobe(ffprobePath); // window에 설치된 ffprobe.exe 경로
			FFmpegProbeResult probeResult = ffprobe.probe(filePath); // 동영상 경로
			FFmpegFormat format = probeResult.getFormat();
			double second = format.duration; // 초단위

			returnData = second + "";
			System.out.println("second==" + second);

			new File(filePath).delete();

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			System.out.println("@@ media_player_time end @@");
		}

		return returnData;
	}

	public void changePlaybackRate(MultipartFile file, double speed) throws IOException, InterruptedException {
		String filePath = "src/main/resources/static/video/input.mp4";
		String outPath = "src/main/resources/static/video/temp.mp4";
		
		File temp = new File(filePath).getCanonicalFile();
		if(!temp.exists()) {
			temp.createNewFile();
		}
		file.transferTo(temp);

		// FFmpegBuilder 객체 생성
		FFmpegBuilder builder = new FFmpegBuilder().setInput(filePath) // 입력 파일 경로
				.addOutput(outPath) // 출력 파일 경로
				.setFormat("mp4") // 출력 파일 포맷
				.disableSubtitle() // 자막 끄기
				.setVideoCodec("libx264") // 비디오 코덱 설정
				.setAudioCodec("aac") // 오디오 코덱 설정
				.setVideoFrameRate(30) // 비디오 프레임 레이트 설정
				.setVideoFilter("setpts=" + (1.0 / speed) + "*PTS") // 비디오 속도 조절
				.done();

		// FFmpeg 실행
		FFmpegExecutor executor = new FFmpegExecutor(new FFmpeg(ffmpegPath), new FFprobe(ffprobePath));
		executor.createJob(builder).run();

		new File(filePath).delete();
	}

}