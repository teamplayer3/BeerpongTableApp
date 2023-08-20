import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { View } from 'react-native';

export enum Route {
    OnStartScreen,
    InConfig,
    InGame,
    ShowStatistics,
    TableConnectionSetup,
    ManualControl,
}

export function Router(props: {
    routes: {
        startScreen: JSX.Element;
        configScreen: JSX.Element;
        gameScreen: JSX.Element;
        statisticScreen: JSX.Element;
        tableConnectionSetup: JSX.Element;
        manualControl: JSX.Element;
    };
}) {
    const [route] = useRouter();

    return route === Route.OnStartScreen ? (
        props.routes.startScreen
    ) : route === Route.InGame ? (
        props.routes.gameScreen
    ) : route === Route.InConfig ? (
        props.routes.configScreen
    ) : route === Route.ShowStatistics ? (
        props.routes.statisticScreen
    ) : route === Route.ManualControl ? (
        props.routes.manualControl
    ) : route === Route.TableConnectionSetup ? (
        props.routes.tableConnectionSetup
    ) : (
        <View />
    );
}

const RouterContext = React.createContext<
    [route: Route, setGameState: Dispatch<SetStateAction<Route>>]
>([Route.OnStartScreen, () => null]);

export const useRouter = () => {
    const context = React.useContext(RouterContext);

    if (context === undefined) {
        throw new Error('useGameState must be used within a GameStateContext');
    }

    return context!;
};

export namespace Router {
    export function Provider(props: {
        children: ReactNode;
        defaultRoute: Route;
    }) {
        const [route, setRoute] = useState(props.defaultRoute);
        return (
            <RouterContext.Provider value={[route, setRoute]}>
                {props.children}
            </RouterContext.Provider>
        );
    }
}
