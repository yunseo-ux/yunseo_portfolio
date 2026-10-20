import { initHero } from './components/Hero/Hero.js';
import { initTeamProject } from './components/TeamProject/TeamProject.js';
import { initApproach } from './components/Approach/Approach.js';
import { initCloneCoding } from './components/CloneCoding/CloneCoding.js';
import { initTeamProjectSlogan } from './components/TeamProject/TeamProjectSlogan.js';
import { initDrawingReveal } from './drawingReveal.js';
import { loadSections } from './sections.js';
import { initChatbot } from './components/Chatbot/Chatbot.js';
import { initPersonalProject } from './components/PersonalProject/PersonalProject.js';
import { initPhotoRail } from './components/PhotoRail/PhotoRail.js';
import { initFooter } from './components/Footer/Footer.js';
import { initAppGallery } from './components/AppProject/AppGallery.js';
import { initAppProposal } from './components/AppProject/AppProposal.js';
import { initSoftwareSkills } from './components/SoftwareSkills/SoftwareSkills.js';
import { initEnding } from './components/Ending/Ending.js';
import { initVideoProject } from './components/VideoProject/VideoProject.js';
import { initViewportStages } from './viewportStages.js';
import { initProjectPreview } from './components/ProjectPreview/project_Preview.js';
import { initMockupVideos } from './mockupVideos.js';

async function start() {
    const root = document.querySelector('#root');
    try {
        await loadSections(root);
    } catch (error) {
        console.error('페이지를 불러오지 못했습니다.', error);
        const message = document.createElement('p');
        message.textContent = '페이지를 불러오지 못했습니다. 개발 서버(npm run dev)에서 열어 주세요.';
        root.replaceChildren(message);
        return;
    }
    for (const initialize of [initHero, initTeamProject, initApproach, initTeamProjectSlogan, initPersonalProject, initDrawingReveal, initCloneCoding, initChatbot, initPhotoRail, initFooter, initAppGallery, initAppProposal, initSoftwareSkills, initVideoProject]) {
        try {
            initialize();
        } catch (error) {
            console.error('화면 기능을 초기화하지 못했습니다.', error);
        }
    }
    initViewportStages();
    initProjectPreview();
    initMockupVideos();
    await initEnding();
}

start();
