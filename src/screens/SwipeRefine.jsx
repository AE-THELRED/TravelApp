import { useMemo, useState } from "react";
import swipes from "../data/swipes.json";
import Art from "../components/Art.jsx";
import Button from "../components/Button.jsx";
import TagMeters from "../components/TagMeters.jsx";
import { buildProfileTags } from "../lib/scoring.js";

/**
 * "Find Your Type" — the refinement pass.
 *
 * A crush nudges a photo's tags up, a pass pulls them down, and the meters on
 * the right recompute on every verdict. That live feedback is the whole point:
 * it shows the profile being built rather than asking the user to trust that
 * one is.
 *
 * The current card index is local state — it is nobody else's business, per
 * docs/STATE.md.
 */
export default function SwipeRefine({ state, dispatch }) {
  const photos = swipes.photos;
  const [index, setIndex] = useState(() => photos.findIndex((p) => state.likes[p.id] === undefined));
  const cursor = index < 0 ? photos.length : index;
  const photo = photos[cursor];
  const done = cursor >= photos.length;

  // Derived, never stored — the same call the deck will make.
  const tags = useMemo(
    () => buildProfileTags(state.picks, state.likes, state.constraints),
    [state.picks, state.likes, state.constraints],
  );

  function verdict(liked) {
    dispatch({ type: "SET_LIKE", photoId: photo.id, liked });
    setIndex(cursor + 1);
  }

  return (
    <div className="screen screen--wide stack stack--lg">
      <div className="stack stack--sm">
        <span className="eyebrow">Step two</span>
        <h1 style={{ fontSize: "30px" }}>
          {done ? "Your type, decided." : "Yes or no?"}
        </h1>
        <p className="muted">
          {done
            ? "That's enough to rank on. You can always come back and change your mind."
            : `Photo ${cursor + 1} of ${photos.length}. Go with your gut.`}
        </p>
      </div>

      <div className="swipe">
        <div className="stack">
          {done ? (
            <div className="card">
              <div className="card__body">
                <span className="eyebrow">Top signals</span>
                <TagMeters tags={tags} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ maxWidth: "360px" }}>
                <Art art={photo.art} caption={photo.caption} className="art--tall" />
              </div>
              <strong>{photo.label}</strong>
              <div className="row">
                <Button onClick={() => verdict(false)}>Not my type</Button>
                <Button variant="primary" onClick={() => verdict(true)}>Crush &hearts;</Button>
              </div>
            </>
          )}

          <div className="row">
            <Button variant="ghost" onClick={() => dispatch({ type: "EDIT_VIBE" })}>
              Back to boards
            </Button>
            <Button
              variant={done ? "primary" : "ghost"}
              onClick={() => dispatch({ type: "COMMIT_VIBE" })}
            >
              {done ? "See your matches" : "Skip to matches"}
            </Button>
          </div>
        </div>

        {!done && (
          <aside className="card">
            <div className="card__body">
              <span className="eyebrow">Your vibe profile</span>
              <TagMeters tags={tags} />
              <p className="dim" style={{ fontSize: "12px", margin: 0 }}>
                This is the vector your matches are ranked against.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
