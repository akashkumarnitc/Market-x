import React from 'react'

function Errors() {
  return (
    <>
    <div role="alert" className="alert alert-info alert-soft">
  <span>12 unread messages. Tap to see.</span>
</div>
<div role="alert" className="alert alert-success alert-soft">
  <span>Your purchase has been confirmed!</span>
</div>
<div role="alert" className="alert alert-warning alert-soft">
  <span>Warning: Invalid email address!</span>
</div>
<div role="alert" className="alert alert-error alert-soft">
  <span>Error! Task failed successfully.</span>
</div>
    </>
  )
}

export default Errors