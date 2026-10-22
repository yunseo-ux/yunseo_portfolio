// Grounded in the portfolio. Only these four topics appear in the main menu.
const links = {
    hyundai: { text: '현대모터스튜디오 사이트', href: 'https://mbc-teamproject-wheat.vercel.app/' },
    hanyul: { text: '한율 사이트', href: 'https://hanyul-three.vercel.app/' },
    movement: { text: '무브먼트랩 사이트', href: 'https://movementlab.vercel.app/' },
    two: { text: '투슬래시포 사이트', href: 'https://twoslashfour.vercel.app/' },
    rola: { text: '로라로라 사이트', href: 'https://rolarola-kappa.vercel.app/' },
    eco: { text: 'EcoAction 프로젝트', href: 'https://www.behance.net/gallery/214281645/EcoAction' },
};

export const topics = [
    { label: '프로젝트 소개', answer: '대표 작업은 현대모터스튜디오와 한율 웹 리뉴얼이에요.\n개인 웹 리뉴얼은 무브먼트랩·투슬래시포·로라로라, 앱 프로젝트는 역사 아카이브 앱 ‘오늘’과 친환경 활동 앱 EcoAction이 있어요.\n프로젝트 이름을 말씀해 주시면 따로 소개해 드릴게요!', section: 'project-preview', link: '프로젝트 둘러보기' },
    { label: '담당 역할', answer: '현대모터스튜디오에서는 메인페이지 구성·UI 디자인과 스타일 가이드 제작을 주도했어요.\n한율은 작업을 나누어 공동으로 진행했고, 발표 장표는 직접 제작했어요.\n무브먼트랩은 메인 콘텐츠 구조와 디자인, ‘오늘’은 공동 기획·UI/UX 디자인을 맡았어요. EcoAction은 기획·디자인·로고를 제작했어요.', section: 'team-project', link: '현대모터스튜디오 자세히 보기' },
    { label: '디자인·기술 역량', answer: '사용자와 브랜드를 관찰하고, 리서치 → 정보 구조·사용 흐름 → UI 디자인으로 구체화해요.\nFigma·Photoshop·Illustrator로 디자인하고, HTML·CSS·JavaScript와 GSAP으로 웹 화면과 인터랙션을 구현해요.\n협업에서는 공통 스타일 가이드로 디자인의 일관성을 맞추는 경험을 쌓았어요.', section: 'software-skills', link: '사용 도구 보기' },
    { label: 'CONTACT', answer: '아래 전화·이메일·GitHub로 연락하실 수 있어요.', contacts: [
        { label: 'PHONE', text: '010-6512-1816', href: 'tel:01065121816' },
        { label: 'EMAIL', text: 'ysoh0217@gmail.com', href: 'mailto:ysoh0217@gmail.com' },
        { label: 'GITHUB', text: 'github.com/yunseo-ux', href: 'https://github.com/yunseo-ux' },
    ] },
];
const introduction = { answer: '안녕하세요! 사용자 관점에서 작은 불편함을 발견하고 더 나은 경험을 고민하는 UI/UX 디자이너 오윤서입니다.\n관찰한 내용을 정리해 디자인으로 구체화하고, 브랜드의 개성과 사용 편의성을 함께 담으려고 해요.', section: 'about', link: '자기소개 보기' };
const process = { answer: 'Observe → Explore → Create의 흐름을 중요하게 생각해요.\n현대모터스튜디오에서는 설문·인터뷰와 브랜드 분석으로 문제를 정리하고, 페르소나·저니맵, 메뉴 구조·사용자 흐름, 와이어프레임과 스타일 가이드로 구체화했어요.', section: 'team-project', link: '디자인 과정 보기' };
const collaboration = { answer: '첫 팀 프로젝트인 한율에서는 작업을 나누어 공동으로 진행하고, 발표 장표는 직접 제작했어요.\n현대모터스튜디오에서는 메인페이지 디자인과 공통 스타일 가이드를 주도하며 전체 디자인의 일관성을 다듬었어요. ‘오늘’에서는 기획·UI/UX 디자인을 공동으로 작업했어요.', section: 'team-project', link: '팀 프로젝트 보기' };
const tools = { answer: '디자인에는 Figma·Photoshop·Illustrator를 사용해요. After Effects·CapCut으로 영상 작업을 하고, ChatGPT·Gemini도 활용해요.\n웹 작업은 VS Code에서 HTML·CSS·JavaScript로 구현하고, 인터랙션에는 GSAP을 활용해요.', section: 'software-skills', link: '사용 도구 보기' };
const fallback = { answer: '질문의 뜻을 정확히 이해하기 어렵거나, 현재 포트폴리오 자료에서 확인할 수 없는 내용이에요.\n프로젝트 이름과 함께 소개·담당 역할·디자인 과정 중 궁금한 점을 조금 더 구체적으로 알려주시겠어요?' };

const projects = [
    { id: 'hyundai', names: ['현대모터스튜디오', '현대', '모터스튜디오', 'hyundai'],
        answer: '현대모터스튜디오 웹사이트를 리뉴얼한 팀 프로젝트예요. 공간·전시·프로그램 정보를 탐색하고 예약으로 이어지는 경험을 다듬었어요.\n메인페이지의 콘텐츠 구성과 UI 디자인, 공통 스타일 가이드 제작을 주도했어요.',
        role: '메인페이지 전체 구성·UI 디자인과 공통 스타일 가이드 제작을 주도했어요. 전체 페이지의 시각적 디테일 조정, 발표 장표 구성·디자인에도 참여했어요.',
        process: process.answer, section: 'team-project', link: '현대모터스튜디오 보기', links: [links.hyundai] },
    { id: 'hanyul', names: ['한율', 'hanyul'],
        answer: '한율 웹사이트 리뉴얼은 첫 팀 프로젝트예요. 한국 자연 원료의 이야기와 온화한 브랜드 감성, 피부 고민별 제품 탐색을 강화했어요.\n작업을 나누어 공동으로 진행했고, 발표 장표는 직접 제작했어요.',
        role: '한율은 처음 진행한 팀 프로젝트로, 작업을 나누어 공동으로 진행했어요. 프로젝트 발표 장표는 직접 제작했어요.',
        process: '기존 사이트에서 자연 원료의 이야기와 브랜드 감성이 충분히 전달되지 않는 점에 주목했어요. 원료 스토리와 피부 고민별 제품 탐색을 강화하는 방향으로 리뉴얼했어요.',
        section: 'hanyul-project', link: '한율 프로젝트 보기', links: [links.hanyul] },
    { id: 'movement', names: ['무브먼트랩', '무브먼트', 'movement'],
        answer: '무브먼트랩 개인 웹 리뉴얼은 공간 중심의 비주얼과 인터랙션으로 브랜드의 감성을 전달한 작업이에요. 브랜드 경험과 제품 탐색이 자연스럽게 연결되도록 디자인했어요.',
        role: '무브먼트랩에서는 메인페이지의 콘텐츠 구조 설계와 메인페이지 디자인 제작을 담당했어요.',
        section: 'personal-project', link: '무브먼트랩 프로젝트 보기', links: [links.movement] },
    { id: 'two', names: ['투슬래시포', '투슬래쉬포', 'twoslashfour', '2slash4'],
        answer: '투슬래시포는 개인 웹사이트 리뉴얼 프로젝트예요. 브랜드의 독창적인 비주얼과 제품 경험을 웹 디자인으로 풀어낸 작업이에요.',
        section: 'personal-project-03', link: '투슬래시포 프로젝트 보기', links: [links.two] },
    { id: 'rola', names: ['로라로라', '로라', 'rolarola'],
        answer: '로라로라는 개인 웹사이트 리뉴얼 프로젝트예요. 브랜드의 감성과 개성을 살린 웹 디자인 작업으로, 포트폴리오에서 상세 화면을 확인하실 수 있어요.',
        section: 'personal-project-04', link: '로라로라 프로젝트 보기', links: [links.rola] },
    { id: 'today', names: ['오늘앱', '앱오늘', '오늘프로젝트', '역사아카이브', 'today'],
        answer: '‘오늘’은 역사 아카이브 앱 팀 프로젝트예요. 위치 기반으로 주변의 역사적 장소와 숨겨진 이야기를 발견하고, 감사의 마음과 기억을 기록하며 과거와 일상을 연결해요.\n기획과 UI/UX 디자인을 공동으로 작업했어요.',
        role: '‘오늘’은 팀 프로젝트로, 기획과 UI/UX 디자인을 공동으로 작업했어요. 세부 화면별 개인 분담까지는 현재 자료에 명시되어 있지 않아요.',
        section: 'app-gallery', link: '오늘 프로젝트 보기' },
    { id: 'eco', names: ['ecoaction', 'eco액션', '에코액션', '친환경앱'],
        answer: 'EcoAction은 친환경 활동을 일상 속 습관으로 연결하는 개인 앱 프로젝트예요. 위치 기반으로 주변 활동을 찾고 참여할 수 있도록 설계했어요.\n기획·UI/UX 디자인·로고 제작을 담당했어요.',
        role: 'EcoAction은 개인 프로젝트로, 친환경 활동을 위한 서비스 기획과 UI/UX 디자인, 로고 제작을 담당했어요.',
        links: [links.eco] },
];

const normalize = text => text.toLowerCase().replace(/[\s·,.!?‘’'"“”/]/g, '');
const includes = (text, words) => words.some(word => text.includes(normalize(word)));
const roleWords = ['담당', '역할', '기여', '혼자', '분담', '맡았', '맡은', '주도'];

export function findReply(question) {
    const text = normalize(question);
    if (!text) return fallback;
    const exact = topics.find(topic => normalize(topic.label) === text);
    if (exact) return exact;
    if (includes(text, ['연봉', '나이', '몇살', '생년', '학교', '학력', '회사경력', '매출', '전환율', '방문자수', '예산', '수상', '팀원수', '몇명', '성과수치', 'mbti', '날씨', '맛집', '채용', '비밀번호'])) return fallback;
    const selected = projects.filter(project => project.names.some(name => text.includes(normalize(name))) || (project.id === 'today' && (text === '오늘' || /오늘(?:의|에서|에대해|은|을)?(?:소개|역할|기획|디자인|앱|담당|기여|협업|프로젝트|설명|사용|과정|링크)/.test(text))));
    if (selected.length > 1) return { answer: '여러 프로젝트를 함께 물어보셨네요. 프로젝트마다 성격과 담당 범위가 달라요.\n현대모터스튜디오·한율·개인 웹 리뉴얼·‘오늘’·EcoAction 중 하나를 골라 주시면 정확히 안내해 드릴게요.' };
    if (selected.length) {
        const project = selected[0];
        const namedOnly = project.names.some(name => normalize(name) === text) || text === '오늘';
        if (!namedOnly && !includes(text, ['소개', '설명', '알려', '어떤', '뭐', '무엇', '보여', '프로젝트', '웹', '앱', '리뉴얼', '디자인', '역할', '담당', '기여', '과정', '협업', '링크', '사이트', '주도', '기획', '기술', '도구', '구현'])) return fallback;
        if (includes(text, ['기술', '코딩', '개발', '구현', '툴', '도구'])) return { answer: '사용 도구는 안내할 수 있지만, 이 프로젝트의 기술별 개인 구현 범위까지는 현재 자료로 확인하기 어려워요.\n' + tools.answer, section: 'software-skills', link: '사용 도구 보기' };
        if (includes(text, roleWords)) return { ...project, answer: project.role || '개인 웹 리뉴얼로 소개된 프로젝트예요. 세부 업무별 담당 범위는 현재 자료에서 확인되지 않아, 더 구체적인 역할은 단정하지 않을게요.' };
        if (includes(text, ['과정', '리서치', '문제', '개선'])) return { ...project, answer: project.process || project.answer };
        return project;
    }
    if (includes(text, ['contact', '연락', '전화', 'phone', '이메일', '메일', 'email', 'github', '깃허브', '깃헙'])) return topics[3];
    if (includes(text, roleWords)) return topics[1];
    if (includes(text, ['협업', '팀워크', '소통', '공동작업'])) return collaboration;
    if (includes(text, ['디자인과정', '디자인방향', '프로세스', '철학', '리서치', '관찰', '설계과정'])) return process;
    if (includes(text, ['기술', '도구', '툴', '스킬', 'figma', '피그마', '포토샵', 'html', 'css', 'javascript', 'gsap', '개발', '코딩'])) return tools;
    if (includes(text, ['개인웹', '개인리뉴얼', '개인프로젝트'])) return { answer: '개인 웹 리뉴얼은 무브먼트랩·투슬래시포·로라로라이고, 개인 앱 프로젝트는 EcoAction이에요.\n웹 작업과 앱 작업을 구분해서 보실 수 있어요. 궁금한 프로젝트 이름을 알려주세요!', section: 'project-preview', link: '프로젝트 둘러보기', links: [links.movement, links.two, links.rola] };
    if (includes(text, ['대표프로젝트', '프로젝트소개', '프로젝트', '포트폴리오', '작업소개'])) return topics[0];
    if (includes(text, ['자기소개', '소개해', '누구', '이름', '안녕', '강점', '장점', '디자이너소개']) || text === '윤서' || text === '오윤서') return introduction;
    return fallback;
}
