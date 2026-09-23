import boards from "../data/boards.json";
import Art from "../components/Art.jsx";
import Button from "../components/Button.jsx";
import Chip from "../components/Chip.jsx";

/**
 * "Your Type" — the coarse aesthetic signal.
 *
 * Picking a board pushes every tag it carries upward. One is enough to rank
 * with; the CTA stays disabled until then rather than letting someone reach an
 * empty deck and conclude the app is broken.
 */
export default function VibeBoards({ state, dispatch }) {
  const picked = state.picks;

  return (
    <div className="screen screen--wide stack stack--lg">
      <div className="stack stack--sm">
        <span className="eyebrow">Step one</span>
        <h1 style={{ fontSize: "30px" }}>Which of these already look like your trip?</h1>
        <p className="muted">
          Pick as many as you like. We&rsquo;ll refine it on the next screen.
        </p>
      </div>

      <div className="board-grid">
        {boards.boards.map((board) => {
          const on = picked.includes(board.id);
          return (
            <button
              key={board.id}
              type="button"
              className={`board ${on ? "board--on" : ""}`}
              aria-pressed={on}
              onClick={() => dispatch({ type: "TOGGLE_BOARD", boardId: board.id })}
            >
              <Art art={board.art} caption={board.caption} className="art--wide" />
              <div className="board__body">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong>{board.title}</strong>
                  {on && <Chip tone="match">In profile</Chip>}
                </div>
                <p className="muted" style={{ fontSize: "13px", margin: 0 }}>{board.note}</p>
                <div className="row">
                  {board.chips.map((c) => <Chip key={c}>{c}</Chip>)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="stack stack--sm">
        <Button
          variant="primary"
          block
          disabled={picked.length === 0}
          onClick={() => dispatch({ type: "GO", screen: "swipe" })}
        >
          {picked.length === 0 ? "Pick at least one board" : "Find your type"}
        </Button>
        <p className="dim" style={{ fontSize: "12.5px", textAlign: "center" }}>
          {picked.length} board{picked.length === 1 ? "" : "s"} in your profile
        </p>
      </div>
    </div>
  );
}
