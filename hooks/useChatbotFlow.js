import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export const useChatbotFlow = ({
    onSearch,
    onCategorySelect,
    onPriceSelect,
    onGenderSelect,
    onBrandSelect,
    setMessages
}) => {
    const router = useRouter();
    const [currentSection, setCurrentSection] = useState('ROOT');
    const transitionTimeoutRef = useRef(null);

    // Clear timeout on unmount to prevent memory leaks or state updates on unmounted component
    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, []);

    const addBotMessage = useCallback((text) => {
        setMessages(prev => [...prev, { text, isBot: true }]);
    }, [setMessages]);

    const addUserMessage = useCallback((text) => {
        setMessages(prev => [...prev, { text, isBot: false }]);
    }, [setMessages]);

    // Centralized messages for section transitions
    const sectionMessages = useMemo(() => ({
        'ROOT': 'Welcome! How can I help you today?',
        'HELP': 'How can we assist with your orders or account?',
        'ENTRY': 'Let\'s get you started. What are you looking for?',
        'DISCOVERY': 'Let\'s find the perfect product. Where should we start?',
        'CATEGORY_SELECTION': 'Which category interests you?',
        'GENDER_SELECTION': 'Who are you shopping for?',
        'PRICE_SELECTION': 'What is your budget?',
        'BRAND_SELECTION': 'Any preferred brand?',
        'OCCASION_SELECTION': 'What is the occasion?',
        'QUICK_ACTIONS': 'Here are some popular shortcuts.',
        'GIFTING': 'Gifting is special! Who is this for?',
        'SMART_SUGGESTIONS': 'Would you like to refine your results?'
    }), []);

    const handleSectionClick = useCallback((sectionKey, label) => {
        // Cancel any pending auto-transitions if user manually clicks
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
        }

        // 1. Record User Click
        if (label) addUserMessage(label);

        // 2. Change Section
        setCurrentSection(sectionKey);

        // 3. Bot Response (if defined for this section)
        if (sectionMessages[sectionKey]) {
            addBotMessage(sectionMessages[sectionKey]);
        }
    }, [addBotMessage, addUserMessage, sectionMessages]);

    const handleAction = useCallback((action, label, nextSection = null) => {
        // Cancel any pending auto-transitions
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
        }

        // 1. Record User Selection
        addUserMessage(label);

        // 2. Perform Action (Safe Checks)
        try {
            if (action.type === 'NAVIGATE') {
                if (router && router.push) {
                    router.push(action.payload);
                    addBotMessage(`Navigating to ${label}...`);
                }
            } else if (action.type === 'SEARCH') {
                if (typeof onSearch === 'function') onSearch(action.payload);
                addBotMessage(`Searching for "${action.payload}"...`);
            } else if (action.type === 'FILTER_CATEGORY') {
                if (typeof onCategorySelect === 'function') onCategorySelect(action.payload);
                addBotMessage(`Showing ${action.payload} products.`);
            } else if (action.type === 'FILTER_PRICE') {
                if (typeof onPriceSelect === 'function') onPriceSelect(action.payload);
                addBotMessage(`Price range set to ${label}.`);
            } else if (action.type === 'FILTER_GENDER') {
                if (typeof onGenderSelect === 'function') onGenderSelect(action.payload);
                addBotMessage(`Showing items for ${label}.`);
            } else if (action.type === 'FILTER_BRAND') {
                if (typeof onBrandSelect === 'function') onBrandSelect([action.payload]);
                addBotMessage(`Showing ${label} products.`);
            } else if (action.type === 'TEXT_RESPONSE') {
                addBotMessage(action.payload);
            } else if (action.type === 'RESET') {
                setCurrentSection('ROOT');
                addBotMessage("Back to main menu.");
            }
        } catch (error) {
            console.error("Chatbot Action Error:", error);
            addBotMessage("Sorry, I encountered an issue. Redirecting you to the home page.");
            if (router && router.push) router.push('/');
        }

        // 3. Auto-Transition to Next Section (if applicable)
        if (nextSection) {
            transitionTimeoutRef.current = setTimeout(() => {
                setCurrentSection(nextSection);
                if (sectionMessages[nextSection]) {
                    addBotMessage(sectionMessages[nextSection]);
                }
                transitionTimeoutRef.current = null;
            }, 600); // Slightly longer delay for better UX
        }
    }, [addBotMessage, addUserMessage, onSearch, onCategorySelect, onPriceSelect, onGenderSelect, router, sectionMessages]);

    const sections = useMemo(() => ({
        ROOT: [
            { label: 'Help / Support', onClick: () => handleSectionClick('HELP', 'Help / Support') },
            { label: 'Start Shopping', onClick: () => handleSectionClick('ENTRY', 'Start Shopping') },
            { label: 'Quick Actions', onClick: () => handleSectionClick('QUICK_ACTIONS', 'Quick Actions') },
            { label: 'Gifting', onClick: () => handleSectionClick('GIFTING', 'Gifting') },
        ],
        HELP: [
            { label: 'Orders', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/orders' }, 'Orders') },
            { label: 'Track my order', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/orders' }, 'Track my order') },
            { label: 'Returns', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/orders' }, 'Returns') },
            { label: 'Replacements', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/orders' }, 'Replacements') },
            { label: 'Refunds', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/orders' }, 'Refunds') },
            { label: 'Payment issues', onClick: () => handleAction({ type: 'TEXT_RESPONSE', payload: 'For payment issues, please contact our support at support@smartbuy.com' }, 'Payment issues') },
            { label: 'Invoice / bill', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/orders' }, 'Invoice / bill') },
            { label: 'Contact Support', onClick: () => handleAction({ type: 'TEXT_RESPONSE', payload: 'You can reach us at support@smartbuy.com' }, 'Contact Support') },
            { label: '← Back', onClick: () => handleSectionClick('ROOT', '← Back') }
        ],
        ENTRY: [
            { label: 'Find a Product', onClick: () => handleSectionClick('DISCOVERY', 'Find a Product') },
            { label: 'Shopping for Gift', onClick: () => handleSectionClick('GIFTING', 'Shopping for Gift') },
            { label: 'Help with Order', onClick: () => handleSectionClick('HELP', 'Help with Order') },
            { label: 'Just Browsing', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'Just Browsing', 'ROOT') },
            { label: '← Back', onClick: () => handleSectionClick('ROOT', '← Back') }
        ],
        DISCOVERY: [
            { label: 'Shop by Category', onClick: () => handleSectionClick('CATEGORY_SELECTION', 'Shop by Category') },
            { label: 'Shop by Gender', onClick: () => handleSectionClick('GENDER_SELECTION', 'Shop by Gender') },
            { label: 'Shop by Budget', onClick: () => handleSectionClick('PRICE_SELECTION', 'Shop by Budget') },
            { label: 'Shop by Occasion', onClick: () => handleSectionClick('OCCASION_SELECTION', 'Shop by Occasion') },
            { label: 'Brand Preference', onClick: () => handleSectionClick('BRAND_SELECTION', 'Brand Preference') },
            { label: '← Back', onClick: () => handleSectionClick('ENTRY', '← Back') }
        ],
        CATEGORY_SELECTION: [
            { label: 'Electronics', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Electronics' }, 'Electronics', 'PRICE_SELECTION') },
            { label: 'Fashion', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Fashion' }, 'Fashion', 'PRICE_SELECTION') },
            { label: 'Home', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Home' }, 'Home', 'PRICE_SELECTION') },
            { label: 'Beauty', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Beauty' }, 'Beauty', 'PRICE_SELECTION') },
            { label: 'Skip', onClick: () => handleSectionClick('PRICE_SELECTION', 'Skip') },
            { label: '← Back', onClick: () => handleSectionClick('DISCOVERY', '← Back') }
        ],
        GENDER_SELECTION: [
            { label: 'Men', onClick: () => handleAction({ type: 'FILTER_GENDER', payload: 'Men' }, 'Men', 'CATEGORY_SELECTION') },
            { label: 'Women', onClick: () => handleAction({ type: 'FILTER_GENDER', payload: 'Women' }, 'Women', 'CATEGORY_SELECTION') },
            { label: 'Kids', onClick: () => handleAction({ type: 'FILTER_GENDER', payload: 'Kids' }, 'Kids', 'CATEGORY_SELECTION') },
            { label: 'Skip', onClick: () => handleSectionClick('CATEGORY_SELECTION', 'Skip') },
            { label: '← Back', onClick: () => handleSectionClick('DISCOVERY', '← Back') }
        ],
        PRICE_SELECTION: [
            { label: 'Under ₹500', onClick: () => handleAction({ type: 'FILTER_PRICE', payload: [0, 500] }, 'Under ₹500', 'SMART_SUGGESTIONS') },
            { label: 'Under ₹1000', onClick: () => handleAction({ type: 'FILTER_PRICE', payload: [0, 1000] }, 'Under ₹1000', 'SMART_SUGGESTIONS') },
            { label: 'Under ₹5000', onClick: () => handleAction({ type: 'FILTER_PRICE', payload: [0, 5000] }, 'Under ₹5000', 'SMART_SUGGESTIONS') },
            { label: 'No Limit', onClick: () => handleAction({ type: 'FILTER_PRICE', payload: [0, 100000] }, 'No Limit', 'SMART_SUGGESTIONS') },
            { label: '← Back', onClick: () => handleSectionClick('DISCOVERY', '← Back') }
        ],
        BRAND_SELECTION: [
            { label: 'Nike', onClick: () => handleAction({ type: 'FILTER_BRAND', payload: 'Nike' }, 'Nike', 'ROOT') },
            { label: 'Adidas', onClick: () => handleAction({ type: 'FILTER_BRAND', payload: 'Adidas' }, 'Adidas', 'ROOT') },
            { label: 'Puma', onClick: () => handleAction({ type: 'FILTER_BRAND', payload: 'Puma' }, 'Puma', 'ROOT') },
            { label: 'H&M', onClick: () => handleAction({ type: 'FILTER_BRAND', payload: 'H&M' }, 'H&M', 'ROOT') },
            { label: '← Back', onClick: () => handleSectionClick('DISCOVERY', '← Back') }
        ],
        OCCASION_SELECTION: [
            { label: 'Casual', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Fashion' }, 'Casual', 'ROOT') },
            { label: 'Party', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Fashion' }, 'Party', 'ROOT') },
            { label: 'Formal', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Fashion' }, 'Formal', 'ROOT') },
            { label: 'Work', onClick: () => handleAction({ type: 'FILTER_CATEGORY', payload: 'Fashion' }, 'Work', 'ROOT') },
            { label: '← Back', onClick: () => handleSectionClick('DISCOVERY', '← Back') }
        ],
        QUICK_ACTIONS: [
            { label: 'Best Deals', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'Best Deals', 'ROOT') },
            { label: 'Trending', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'Trending', 'ROOT') },
            { label: 'New Arrivals', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'New Arrivals', 'ROOT') },
            { label: 'Top Rated', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'Top Rated', 'ROOT') },
            { label: 'On Sale', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'On Sale', 'ROOT') },
            { label: '← Back', onClick: () => handleSectionClick('ROOT', '← Back') }
        ],
        GIFTING: [
            { label: 'For Him', onClick: () => handleAction({ type: 'FILTER_GENDER', payload: 'Men' }, 'For Him', 'PRICE_SELECTION') },
            { label: 'For Her', onClick: () => handleAction({ type: 'FILTER_GENDER', payload: 'Women' }, 'For Her', 'PRICE_SELECTION') },
            { label: 'For Kids', onClick: () => handleAction({ type: 'FILTER_GENDER', payload: 'Kids' }, 'For Kids', 'PRICE_SELECTION') },
            { label: 'By Budget', onClick: () => handleSectionClick('PRICE_SELECTION', 'By Budget') },
            { label: '← Back', onClick: () => handleSectionClick('ROOT', '← Back') }
        ],
        SMART_SUGGESTIONS: [
            { label: 'Show Similar', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'Show Similar', 'ROOT') },
            { label: 'See Trending', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'See Trending', 'ROOT') },
            { label: 'Best Deals', onClick: () => handleAction({ type: 'NAVIGATE', payload: '/' }, 'Best Deals', 'ROOT') },
            { label: 'Back to Menu', onClick: () => handleSectionClick('ROOT', 'Back to Menu') }
        ]
    }), [handleSectionClick, handleAction]);

    return {
        currentOptions: sections[currentSection] || sections['ROOT'],
        currentSection
    };
};
