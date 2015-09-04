## Introduction to git commits

### Level 1
* `git commit -m "First commit"`
* `git commit -m "Second commit"`

### Level 2
* `git checkout -b bugFix`

### Level 3
* `git checkout -b bugFix`
* `git commit -m "Commit on BugFix"`
* `git checkout master`
* `git commit -m "commit on master"`
* `git merge bugFix`

### Level 4
* `git checkout -b bugFix`
* `git commit -m "Commit on BugFix"`
* `git checkout master`
* `git commit -m "commit on master"`
* `git checkout bugFix`
* `git rebase master`

### ScreenShot
![First 4 level progress](first_4.png)

## Detach yo' Head

### Level 1
* `git checkout bugFix`
* `git checkout C4`

### Level 2
* `git checkout bugFix^`

### Level 3
* `git checkout HEAD^`
* `git branch -f bugFix HEAD^`
* `git checkout C6`
* `git branch -f master HEAD`
* `git checkout HEAD~3`

### Level 4
* `git reset HEAD~1`
* `git checkout pushed`
* `git revert HEAD`

## Cherry-pick Intro
* `git cherry-pick C3 C4 C7`
* `git rebase -i HEAD~4 --aboveAll`

## Bonus screen shot

![Bonus](bonus.png)