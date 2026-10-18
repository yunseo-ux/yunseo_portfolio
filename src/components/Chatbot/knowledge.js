export const topics = [
    { label: '자기소개', keywords: ['소개', '누구', '이름', '안녕', '윤서', '강점', '장점'], answer: '안녕하세요! UI/UX 디자이너 오윤서입니다. 사용자의 시선에서 작은 불편함을 발견하고, 더 나은 경험을 고민합니다. 아이디어를 정리하고 디자인을 실제 경험으로 구현하며, 사용자와 비즈니스를 모두 고려한 의미 있는 디자인을 만들어가고자 합니다.', section: 'about', link: '소개 보러 가기' },
    { label: '디자인 방향', keywords: ['방향', '가치', '철학', '중요', '디자이너', '목표', '과정'], answer: '작은 관찰에서 시작된 생각을 기록하고, 다양한 시도 속에서 새로운 가능성을 발견합니다. 그 과정에서 쌓인 경험을 나만의 디자인으로 그려냅니다. Observe → Explore → Create의 흐름을 중요하게 생각합니다.', section: 'intro', link: '디자인 이야기 보기' },
    { label: '진행한 프로젝트', keywords: ['프로젝트', '작업', '포트폴리오', '무브먼트', '로라', '투슬래시', '개인'], answer: '현대 모터스튜디오 웹사이트 리뉴얼 팀 프로젝트와 무브먼트랩·투슬래시포·로라로라 웹사이트 리뉴얼 작업을 포트폴리오에서 확인할 수 있습니다.', section: 'project-preview', link: '프로젝트 둘러보기' },
    { label: '팀 프로젝트 역할', keywords: ['역할', '기여', '담당', '협업', '현대', '모터', '팀'], answer: '현대모터스튜디오 웹사이트 리뉴얼 프로젝트에서 메인페이지의 콘텐츠 구조 설계와 UI 디자인, 스타일 가이드 제작을 주도적으로 담당했습니다. 공통 스타일과 간격을 정리해 디자인의 일관성을 높이고, 발표 장표 제작에도 참여했습니다. 사용자 관점에서 정보의 우선순위를 재구성하여 다양한 콘텐츠를 직관적으로 탐색하고 예약까지 자연스럽게 이어질 수 있도록 설계했습니다.', emphasis: '메인페이지의 콘텐츠 구조 설계와 UI 디자인, 스타일 가이드 제작을 주도적으로 담당했습니다.', section: 'team-project', link: '팀 프로젝트 자세히 보기' },
    { label: '사용하는 도구', keywords: ['도구', '툴', '기술', '스킬', 'figma', '피그마', '포토샵', 'html', 'css', '개발', '코딩'], answer: '디자인에는 Figma, Photoshop, Illustrator를 사용합니다. After Effects와 CapCut, ChatGPT와 Gemini도 활용하며, VS Code에서 HTML·CSS·JavaScript로 화면을 구현합니다.', section: 'software-skills', link: '사용 도구 보기' },
];

export function findReply(question) {
    const normalized = question.toLowerCase().replace(/\s+/g, '');
    // Specific project questions take priority over a general introduction.
    const order = [topics[3], topics[4], topics[2], topics[1], topics[0]];
    const exact = topics.find(topic => topic.label.replace(/\s+/g, '') === normalized);
    return exact || order.find(topic => topic.keywords.some(word => normalized.includes(word))) || {
        answer: '지금은 포트폴리오에 담긴 소개와 작업 정보를 안내하고 있어요. 자기소개, 디자인 방향, 프로젝트, 담당 역할, 사용 도구 중 궁금한 내용을 골라 주세요.',
    };
}
