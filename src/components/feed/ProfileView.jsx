// src/components/feed/ProfileView.jsx
// 2015 profile: blue header with the username centered (gear on your own,
// back chevron on others), round avatar at left, posts / followers / following
// at right with an "Edit Profile" or "Follow" button beneath, name + bio, the
// grid / list / pin / tagged row, then the 3-column grid. The player's own
// profile is empty and shows the first-run copy with a blue arrow toward the
// camera tab.
// Props:
//   username   — whose profile; omit for the player's own
//   onBack     — shown as a back chevron when present
//   onOpenPost — (post) => void

import NavBar from './NavBar'
import Avatar from './Avatar'
import PhotoGrid from './PhotoGrid'
import { ME, getProfile, isFollowing } from './feedData'
import { useIsFollowing, useFollowingCount, toggleFollow, adjustCount } from './followStore'
import {
  BackChevronIcon, GearIcon, GridModeIcon, ListModeIcon, PinModeIcon, TaggedModeIcon, DownArrowIcon,
} from './icons'

function Stat({ n, label }) {
  return (
    <div className="profileStat">
      <div className="profileStatNum">{n}</div>
      <div className="profileStatLabel">{label}</div>
    </div>
  )
}

function ModeRow() {
  return (
    <div className="profileModes">
      <div className="profileMode profileModeOn"><GridModeIcon /></div>
      <div className="profileMode"><ListModeIcon /></div>
      <div className="profileMode"><PinModeIcon /></div>
      <div className="profileMode"><TaggedModeIcon /></div>
    </div>
  )
}

export default function ProfileView({ username, onBack, onOpenPost }) {
  const own = !username
  const following = useIsFollowing(username)
  const myFollowing = useFollowingCount()
  // The profile's count already includes the player if they followed at the
  // start; move it by one when that changes.
  const followDelta = own ? 0 : (following ? 1 : 0) - (isFollowing(username) ? 1 : 0)
  const profile = own ? null : getProfile(username)
  const title = (own ? ME.username : username).toUpperCase()

  return (
    <>
      <NavBar
        title={title}
        left={onBack && (
          <button className="feedNavBtn" onClick={onBack} aria-label="Back"><BackChevronIcon /></button>
        )}
        right={own && <button className="feedNavBtn" aria-label="Settings"><GearIcon /></button>}
      />

      <div className={own ? 'feedScroll profileScroll profileScrollOwn' : 'feedScroll profileScroll'}>
        <div className="profileTop">
          {own
            ? <div className="profileAvatarEmpty" aria-hidden="true" />
            : <Avatar photo={profile.avatar} color={profile.avatarColor} initial={profile.initial} size={77} />}
          <div className="profileRight">
            <div className="profileStats">
              <Stat n={own ? ME.posts : profile.posts} label="posts" />
              <Stat n={own ? ME.followers : adjustCount(profile.followers, followDelta)} label="followers" />
              <Stat n={own ? myFollowing : profile.following} label="following" />
            </div>
            {own
              ? <button className="editProfileBtn">Edit Profile</button>
              : (
                <button
                  className={following ? 'followBtn followBtnOn' : 'followBtn'}
                  onClick={() => toggleFollow(username)}
                >
                  {following ? '✓ Following' : '+ Follow'}
                </button>
              )}
          </div>
        </div>

        {!own && (
          <div className="profileBio">
            <div className="profileName">{profile.name}</div>
            {profile.bio && <div className="profileBioText">{profile.bio}</div>}
            {profile.website && <div className="profileWebsite">{profile.website}</div>}
          </div>
        )}

        <ModeRow />

        {own
          ? (
            <div className="profileEmpty">
              <div className="profileEmptyTop">Start capturing and sharing your moments.</div>
              <div className="profileEmptyBottom">
                <div><b>Tap on the camera</b> to share your first photo or video.</div>
                <div className="profileEmptyArrow"><DownArrowIcon /></div>
              </div>
            </div>
          )
          : <PhotoGrid tiles={profile.grid} onOpenPost={onOpenPost} />}
      </div>
    </>
  )
}
