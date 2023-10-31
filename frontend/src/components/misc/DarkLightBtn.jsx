import cx from "clsx";
import {
  Switch,
  useMantineColorScheme,
  useComputedColorScheme,
  Group,
} from "@mantine/core";
import classes from "./DarkLightBtn.module.css";

export function DarkLightBtn() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Group justify="center" p="md">
      <Switch
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        aria-label="Toggle color scheme"
        classNames={classes}
      >
        {/* <IconSun
          className={cx(
            classes.icon,
            computedColorScheme === "light" ? classes.light : classes.dark
          )}
          stroke={1.5}
        /> */}
        {/* {computedColorScheme === "dark" && (
          <IconMoon className={cx(classes.icon, classes.light)} stroke={1.5} />
        )} */}
      </Switch>
    </Group>
  );
}