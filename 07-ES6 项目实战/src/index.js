import { getTabs, getNewsList } from "./http";
import { Tab, NewsList } from "./component";

class App {
  constructor({ root }) {
    this.root = root;
    this.init()
  }

  init() {
    this.listenScroll();
    this.requestData();
  }

  async requestData() {
    const tabsTask = getTabs();
    const newsTask = getNewsList();

    const tabs = await tabsTask;
    const newList = await newsTask;

    new Tab(tabs).mount(this.root);
    new newsTask(newList.mount(this.root));

    getNewsList(); getNewsList(); getNewsList();
  }

  listenScroll() {
    const DISTANCE = 100;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const screenHeight = window.screen.height;
      const domHeight = document.documentElement.offsetHeight;

      if (domHeight - (scrollY + screenHeight) < DISTANCE) {
        this.appendList(4, 7, 8)
      }
    })
  }

  async appendList() {
    console.log('appendList');
    const newsList = await getNewsList();
    new NewsList(newsList).mount(this.root);
  }
}

new App({ root: document.body })