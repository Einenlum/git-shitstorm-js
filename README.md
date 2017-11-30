# Git Shitstorm

A tool to make developers become crazy.

**This is for educational purpose only**.

## Presentation

Git Shitstorm is a tool written in nodejs, to mess up silently with git history of a project.

### Why?

This tool is inspired by a colleague who always encountered the most crazy things on his computer. I thought it could be interesting to force this bad luck and to find what could be the most trolling thing ever. Here is how this evil tool will make you lose your mind.

### Mechanism

Git Shitstorm progressively and silently messes up with git history, every time you use the git command, in several steps.

* 1/ Around 90% of the time (but this is configurable), it does absolutely nothing and stop. If you're unlucky enough, it starts the shitstorm.
* 2/ It stashes the current work in the target git repository to restore it later.
* 3/ It looks at all of the commit names of your current branch and store one.
* 4/ It looks at all the local branches and select one randomly to check out.
* 5/ It takes several random lines of a random file of your project and copy them.
* 6/ It looks for another random file of the same extension (or any other file if nothing found) and paste randomly somewhere the copied text in it.
* 7/ It commits the changes with the *exact same name* of the commit it found before.
* 8/ It comes back to your initial branch and stash pop.

All this happens silently. If you want to make a prank to someone (which I would not recommend), that could look like this:
You change their git alias to use Git Shitstorm instead, that it launches randomly and silently.
At one point they realize their app is working in a weird way or even not working anymore.
When they try to understand what happened, they realize their commited something new (with a real commit name, and probably their own!), and that they pasted real code they wrote (or someone of their team) to another file.

This could lead everyone to craziness. Would you suspect a tool to do that shit? Probably not. It's too fucked up.
Oh, and it obviously does not require any root password.

## Usage

### Launch it

Git Shitstorm has several configurable options:

* `--ultraverbose`: (`-V`) a boolean to activate all error and notice logs (default: `false`)
* `--verbose`: (`-v`) a boolean to activate only error logs (default: `false`)
* `--dir`: (`-d`) a string to configure the target git directory (default: the current directory from where you launched Git Shitstorm)
* `--chance`: (`-c`) a number (representing a percentage) between 1 and 100 to configure how often Git Shitstorm will unleash the beast (default to `10`)
* `--executable`: (`-e`) a string to configure the git executable to be used (default to `git`)

You can see what happens in a ultraverbose mode. The vuejs repository was taken for the example:

```
➜  vue git:(testbranch) node ~/git-shitstorm/index.js -V -c 100
Let's have some fun. Shall we?
*** Saving current state (stashing) ***
*** Getting a random commit ***
Chosen commit name: "handle component listeners"
*** Getting branches ***
Initial branch: testbranch
Target branch: dev
*** Finding files ***
*** Getting random lines of file test/unit/features/options/renderError.spec.js ***
Selected lines to copy: 

      expect(vm.$el.textContent).toBe('Error: no')
      Vue.config.errorHandler = null
    }).then(done)
  })

  it('should pass on errors in renderError to global handler', () => {
    const spy = Vue.config.errorHandler = jasmine.createSpy()
    const err = new Error('renderError')
    const vm = new Vue({
      render () {
        throw new Error('render')
      },
      renderError () {
        throw err
      }
    }).$mount()
    expect(spy).toHaveBeenCalledWith(err, vm, 'renderError')
  })


*** Pasting selected text to src/core/instance/render.js ***
*** Commiting the changes ***
*** Restoring initial state ***
Checkout to initial branch testbranch
No stash found.

➜  vue git:(testbranch) git checkout dev
Switched to branch 'dev'
Your branch is ahead of 'origin/dev' by 1 commit.
  (use "git push" to publish your local commits)

➜  vue git:(testbranch) git log
commit 95552a2dbd7138004c2c22debe7675c48c6d8036
Author: Einenlum <einenlum@vmail.me>
Date:   Mon Nov 13 14:21:36 2017 +0100

    handle component listeners

commit 9463ac8746f57d1dff6f958b7d79765aa0979fa8
Author: Evan You <yyx990803@gmail.com>
Date:   Tue Nov 7 17:25:55 2017 -0500

    test: fix weex tests
```

### How to alias it

First, you will still need to have a way to call directly git.
To do that you can for example create a symbolic link like `ln -s /usr/bin/git ~/.bin/sgit` (choose a directory that is used in the `PATH` of your `.bashrc` or `.zshrc`, or add this directory in the `export PATH` line).

Clone this tool in a hidden place and do an `npm install`.

Add in the `.bashrc` or `.zshrc` a git alias, like :

`alias git="node /path/to/the/cloned/repo/git-shitstorm/index.js --executable=sgit && sgit"`

You can add a few options (like `-c 100` to make it launch every single time, or `-V` to check temporarly that it works).

### Ethics?

I never used it on anybody except me, just to see if it works smoothly, and I totally discourage using it on someone else.
Then you could ask why I would publish it on Github. First, it's for educational purpose.
Second, if you leave your computer unlocked and someone wants to hurt you, they will find a way to do it. Trust me.
After all, a `rm -Rf ~` does not require a root password… (if you're a newbie, don't do this command please).
