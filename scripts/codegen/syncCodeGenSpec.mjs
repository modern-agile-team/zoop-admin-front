import fs from 'fs';

// OpenAPI 스펙이 있는 URL
const SPEC_URL = {
  API: 'https://lsh.taild0f974.ts.net/backend/swagger-json',
  SOCKET: 'https://lsh.taild0f974.ts.net/backend/async-doc-json',
};

// 스펙을 저장할 파일 경로
const SPEC_WRITE_PATH = {
  API: 'src/lib/apis/spec.json',
  SOCKET: 'src/lib/socket/spec.json',
};

// 필터링할 path prefix
const PATH_PREFIX = '/admin';

console.log('API 스펙을 가져오는 중...');

const getSpec = async (type) => {
  try {
    const response = await fetch(SPEC_URL[type]);
    if (!response.ok) {
      throw new Error(`HTTP 에러: ${response.status}`);
    }

    const data = await response.json();

    // ✅ admin path만 필터링
    const originalPaths = data.paths || {};
    const filteredPaths = Object.fromEntries(
      Object.entries(originalPaths).filter(([path]) =>
        path.startsWith(PATH_PREFIX)
      )
    );

    if (Object.keys(filteredPaths).length === 0) {
      console.warn(
        `⚠️ [${type}] '${PATH_PREFIX}'로 시작하는 경로가 없습니다. 저장을 건너뜁니다.`
      );
      return; // 파일 저장 스킵
    }

    // ✅ 기존 spec의 구조 유지하면서 paths만 교체
    const filteredSpec = {
      ...data,
      paths: filteredPaths,
    };

    const jsonContent = JSON.stringify(filteredSpec, null, 2);

    // 해당하는 폴더가 없으면 생성
    const dirPath = SPEC_WRITE_PATH[type].split('/').slice(0, -1).join('/');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 폴더가 생성되었습니다: ${dirPath}`);
    }

    fs.writeFileSync(SPEC_WRITE_PATH[type], jsonContent, 'utf8');
    console.log(`✅ [${type}] spec.json 파일이 성공적으로 저장되었습니다.`);
  } catch (error) {
    console.error(`❌ [${type}] 스펙 처리 중 에러 발생:`, error);
    throw error;
  }
};

// 병렬로 API와 SOCKET 스펙 가져오기
const results = await Promise.allSettled([getSpec('API'), getSpec('SOCKET')]);

results.forEach((result, index) => {
  const type = index === 0 ? 'API' : 'SOCKET';
  if (result.status === 'fulfilled') {
    console.log(`🎉 [${type}] 작업 성공`);
  } else {
    console.error(`💥 [${type}] 작업 실패:`, result.reason);
  }
});
