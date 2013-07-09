A more advanced `fleet-stop` command line tool that supports regular expressions. [Fleet](https://github.com/substack/fleet) by Substack is an excellent for managing deployment. However stopping running processes can be a bit tedious. The `fleet-stopregex` module provides a command-line tool to stop drone process command and commit in addition to the standard `fleet-stop pid#foo` command. You can pass a regular expression as the last parameter. Any drones which match this regular expression will be stopped.

# Installation
```bash
npm install -g fleet-stopregex
```

# Usage

```bash
fleet-stopregex --field [command, commit, pid] <regex> <regex flags>
```

The script matches the regular expression against the specified all field for every spawned process. For any process which matches, that process is then killed. You will receive a prompt asking you to confirm killing the processes before they are killed

If field is omitted then **pid** will be used as the default.

Note that *--field* is aliased to *-f*, therefore
`fleet-stopregex --field command` = `fleet-stopregex -f command`


To automatically stop all matching process without confirmation, pass the `-y` or `--yes` flag as a parameter

```bash
fleet-stopregex --yes --field commit fbdcfba04752fe6f42be6e49461b8d2dec63c31e
```

# Examples

**Stop PID**
Same as vanilla fleet-stop. However fleet-stopregex will retry the stop command until it succeeds
```
fleet-stopregex pid#b0a13c
```

**By Git Commit**
Stop all processes which have an exact commit

```bash
fleet-stopregex --field commit fbdcfba04752fe6f42be6e49461b8d2dec63c31e
```

**Regex Flags**
Flags can be passed as optional last parameter. This flags are the same as you would pass to new RegExp(pattern, flags).

```bash
# stop processes with name both foo or Foo
fleet-stopregex --field command foo i
```

**Stop everything**
Pass a "." as the regex which will match everything
```bash
fleet-stopregex .
```

Note that * will not work as regex string unless it is quoted as "*"
```bash
# Good
fleet-stopregex "*"
```
```bash
# Bad
fleet-stopregex *
```

# Inspiration
This module came out of the [managing redeploy](https://github.com/substack/fleet/issues/18) issue
