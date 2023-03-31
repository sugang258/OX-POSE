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
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class VideoFileUtils {

	@Value("${ffmpeg.location}")
	private String ffmpegPath;
	@Value("${ffprobe.location}")
	private String ffprobePath;

	/**
	 * 비디오 파일을 배속해서 저장하는 함수
	 * @param file : 파일
	 * @param speed : 배속
	 * @return 
	 */
	public String changePlaybackRate(MultipartFile file, double speed) throws IOException, InterruptedException {
		String fileName = file.getOriginalFilename();
		
		String filePath = "src/main/webapp/resources/upload/" + UUID.randomUUID().toString() + fileName;
		String outPath = "src/main/webapp/resources/upload/" + UUID.randomUUID().toString() +fileName;
		
		File temp = new File(filePath).getCanonicalFile();
		if(!temp.exists()) {
			temp.createNewFile();
		}
		file.transferTo(temp);

		FFprobe ffprobe = new FFprobe(ffprobePath); // window에 설치된 ffprobe.exe 경로
		FFmpegProbeResult probeResult = ffprobe.probe(filePath); // 동영상 경로
		double second = probeResult.getFormat().duration;
		log.info("playtime : {}",second);
		FFmpegBuilder builder = new FFmpegBuilder().setInput(filePath) // 입력 파일 경로
				.addOutput(outPath) // 출력 파일 경로
				.setFormat("mp4") // 출력 파일 포맷
				.disableSubtitle() // 자막 끄기
				.setVideoCodec("libx264") // 비디오 코덱 설정
				.setAudioCodec("aac") // 오디오 코덱 설정
				.setVideoFrameRate(30) // 비디오 프레임 레이트 설정
				.setVideoFilter("setpts=" + (1.0 / speed) + "*PTS") // 비디오 속도 조절
				.setDuration((long)(second*1000/speed), TimeUnit.MILLISECONDS)
				.done();

		// FFmpeg 실행
		FFmpegExecutor executor = new FFmpegExecutor(new FFmpeg(ffmpegPath), ffprobe);
		executor.createJob(builder).run();

		new File(filePath).delete();
		return outPath;
	}

}