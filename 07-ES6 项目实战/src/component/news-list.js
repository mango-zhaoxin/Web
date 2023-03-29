import Component from "./component";
export default class NewsList extends Component {
  render() {
    const { data: newsList } = this.props.data
    return (
      `<ul>
        ${newsList.map(news => {
        return (
          `
            <li>
              <h3>${news.title}</h3>
              <img src="${news.image_url}" alt="${news.title}"/>
            </li>
            `
        )
      })}
      </ul>`
    )
  }
}