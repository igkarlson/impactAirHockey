import { useCalendars, useLocales } from 'expo-localization';
import { NetworkStateType, useNetworkState } from 'expo-network';

import { COUNTRIES } from './constants';

export const useBlockedByCountry = (
  whiteListIso2: (keyof typeof COUNTRIES)[] = [],
  blackListIso2: (keyof typeof COUNTRIES)[] = [],
) => {
  const [calendars] = useCalendars();

  const [locales] = useLocales();

  const { type } = useNetworkState();

  if (whiteListIso2.length) {
    const whiteList = whiteListIso2.reduce<string[]>(
      (whiteList, iso2) => [...whiteList, ...COUNTRIES[iso2].timezones],
      [],
    );

    const allowedTimezones = new Set(whiteList);

    const isAllowedCalendar = [calendars].some(({ timeZone }) =>
      allowedTimezones.has(timeZone?.toLowerCase() ?? ''),
    );

    const isAllowedLocale = [locales].some(({ languageTag, regionCode }) => {
      return whiteListIso2.some(
        (iso2) =>
          regionCode?.toLowerCase() === iso2 ||
          languageTag.toLowerCase().includes(iso2),
      );
    });

    const isWhiteListed =
      isAllowedCalendar !== isAllowedLocale
        ? type === NetworkStateType.VPN
        : isAllowedCalendar || isAllowedLocale;

    return !isWhiteListed;
  }

  if (blackListIso2.length) {
    const blackList = blackListIso2.reduce<string[]>(
      (blackList, iso2) => [...blackList, ...COUNTRIES[iso2].timezones],
      [],
    );

    const blockedTimezones = new Set(blackList);

    const isBlockedCalendar = [calendars].some(({ timeZone }) =>
      blockedTimezones.has(timeZone?.toLowerCase() ?? ''),
    );

    const isBlockedLocale = [locales].some(({ languageTag, regionCode }) => {
      return blackListIso2.some(
        (iso2) =>
          regionCode?.toLowerCase() === iso2 ||
          languageTag.toLowerCase().includes(iso2),
      );
    });

    const isBlackListed =
      isBlockedCalendar !== isBlockedLocale
        ? type !== NetworkStateType.VPN
        : isBlockedCalendar || isBlockedLocale;

    return isBlackListed;
  }

  return true;
};
