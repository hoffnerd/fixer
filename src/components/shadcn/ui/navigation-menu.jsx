import * as React from "react";
import Link from "next/link";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/util/shadcn";



//______________________________________________________________________________________
// ===== Component | NavigationMenu =====

const NavigationMenu = React.forwardRef(
    ({  xPosition="left-0", className, children, ...props }, ref) => (
        <NavigationMenuPrimitive.Root
            ref={ref}
            className={cn(
                "relative z-10 flex max-w-max flex-1 items-center justify-center",
                className
            )}
            {...props}
        >
            {children}
            <NavigationMenuViewport xPosition={xPosition} />
        </NavigationMenuPrimitive.Root>
    )
);
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;



//______________________________________________________________________________________
// ===== Component | NavigationMenuList =====

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn(
            "group flex flex-1 list-none items-center justify-center space-x-1",
            className
        )}
        {...props}
    />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;



//______________________________________________________________________________________
// ===== Component | NavigationMenuItem =====

const NavigationMenuItem = NavigationMenuPrimitive.Item;



//______________________________________________________________________________________
// ===== Component | NavigationMenuTrigger =====

const navigationMenuTriggerStyle = cva(
    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

const NavigationMenuTrigger = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <NavigationMenuPrimitive.Trigger
            ref={ref}
            className={cn(navigationMenuTriggerStyle(), "group", className)}
            {...props}
        >
            {children}{" "}
            <ChevronDown
                className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
            />
        </NavigationMenuPrimitive.Trigger>
    )
);
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;



//______________________________________________________________________________________
// ===== Component | NavigationMenuContent =====

const NavigationMenuContent = React.forwardRef(
    ({ className, ...props }, ref) => (
        <NavigationMenuPrimitive.Content
            ref={ref}
            className={cn(
                "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
                className
            )}
            {...props}
        />
    )
);
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;



//______________________________________________________________________________________
// ===== Component | NavigationMenuLink =====

const NavigationMenuLink = NavigationMenuPrimitive.Link;



//______________________________________________________________________________________
// ===== Component | NavigationMenuViewport =====

const NavigationMenuViewport = React.forwardRef(
    ({ xPosition="left-0", className, ...props }, ref) => (
        <div className={cn(`absolute ${xPosition} top-full flex justify-center`)}>
            <NavigationMenuPrimitive.Viewport
                className={cn(
                    "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    )
);
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;



//______________________________________________________________________________________
// ===== Component | NavigationMenuIndicator =====

const NavigationMenuIndicator = React.forwardRef(
    ({ className, ...props }, ref) => (
        <NavigationMenuPrimitive.Indicator
            ref={ref}
            className={cn(
                "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
                className
            )}
            {...props}
        >
            <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
        </NavigationMenuPrimitive.Indicator>
    )
);
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;



//______________________________________________________________________________________
// ===== Component | NavigationListItem =====

const NavigationListItem = React.forwardRef(
    ({ className, title, children, ...props }, ref) => (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
)
NavigationListItem.displayName = "NavigationListItem"



//______________________________________________________________________________________
// ===== Exports =====

export {
    navigationMenuTriggerStyle,
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
    NavigationListItem,
};
