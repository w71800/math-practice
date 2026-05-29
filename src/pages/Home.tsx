import { Link } from 'react-router-dom'
import { getPracticeList } from '../lib/practices'

export function Home() {
  const practices = getPracticeList()

  return (
    <div className="page home-page">
      <header className="page-header">
        <h1>學生練習</h1>
        <p className="page-subtitle">選擇一份練習開始作答</p>
      </header>

      {practices.length === 0 ? (
        <p className="empty-state">尚無練習檔案，請在 practices 資料夾新增 .md 檔。</p>
      ) : (
        <ul className="practice-list">
          {practices.map((practice) => (
            <li key={practice.slug}>
              <Link to={`/practice/${practice.slug}`} className="practice-card">
                <h2>{practice.title}</h2>
                {practice.description ? (
                  <p>{practice.description}</p>
                ) : null}
                <span className="practice-link-hint">進入練習 →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
