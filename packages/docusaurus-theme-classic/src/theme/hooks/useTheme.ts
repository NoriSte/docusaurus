/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const themes = {
  light: '',
  dark: 'dark',
};

const useTheme = (): {
  isDarkTheme: boolean;
  setLightTheme: () => void;
  setDarkTheme: () => void;
} => {
  const {
    siteConfig: {themeConfig: {disableDarkMode = false} = {}} = {},
  } = useDocusaurusContext();
  const [theme, setTheme] = useState(
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme')
      : themes.light,
  );
  const setThemeSyncWithLocalStorage = useCallback(
    (newTheme) => {
      try {
        localStorage.setItem('theme', newTheme);
      } catch (err) {
        console.error(err);
      }
    },
    [setTheme],
  );
  const setLightTheme = useCallback(() => {
    setTheme(themes.light);
    setThemeSyncWithLocalStorage(themes.light);
  }, []);
  const setDarkTheme = useCallback(() => {
    setTheme(themes.dark);
    setThemeSyncWithLocalStorage(themes.dark);
  }, []);

  useEffect(() => {
    // @ts-expect-error: safe to set null as attribute
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (disableDarkMode) {
      return;
    }

    try {
      const localStorageTheme = localStorage.getItem('theme');
      if (localStorageTheme !== null) {
        setTheme(localStorageTheme);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setTheme]);

  useEffect(() => {
    if (disableDarkMode) {
      return;
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addListener(({matches}) => {
        setTheme(matches ? themes.dark : themes.light);
      });
  }, []);

  return {
    isDarkTheme: theme === themes.dark,
    setLightTheme,
    setDarkTheme,
  };
};

export default useTheme;
