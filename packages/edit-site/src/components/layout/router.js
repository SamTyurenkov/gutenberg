/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { useIsSiteEditorLoading } from './hooks';
import Editor from '../editor';
import PagePages from '../page-pages';
import PagePatterns from '../page-patterns';
import PageTemplatesTemplateParts from '../page-templates-template-parts';

import {
	TEMPLATE_POST_TYPE,
	TEMPLATE_PART_POST_TYPE,
} from '../../utils/constants';

const { useLocation } = unlock( routerPrivateApis );

export default function useLayoutAreas() {
	const isSiteEditorLoading = useIsSiteEditorLoading();
	const { params } = useLocation();
	const { postType, postId, path, layout, isCustom, canvas } = params ?? {};

	// Note: Since "sidebar" is not yet supported here,
	// returning undefined from "mobile" means show the sidebar.

	// Regular page
	if ( path === '/page' ) {
		return {
			areas: {
				content: undefined,
				preview: <Editor isLoading={ isSiteEditorLoading } />,
				mobile:
					canvas === 'edit' ? (
						<Editor isLoading={ isSiteEditorLoading } />
					) : undefined,
			},
			widths: {
				content: undefined,
			},
		};
	}

	const isListLayout = isCustom !== 'true' && layout === 'list';

	if ( path === '/pages' ) {
		return {
			areas: {
				content: <PagePages />,
				preview: isListLayout && (
					<Editor isLoading={ isSiteEditorLoading } />
				),
			},
			widths: {
				content: isListLayout ? 380 : undefined,
			},
		};
	}

	// Regular other post types
	if ( postType && postId ) {
		return {
			areas: {
				preview: <Editor isLoading={ isSiteEditorLoading } />,
				mobile:
					canvas === 'edit' ? (
						<Editor isLoading={ isSiteEditorLoading } />
					) : undefined,
			},
		};
	}

	// Templates
	if ( path === '/wp_template/all' ) {
		return {
			areas: {
				content: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_POST_TYPE }
					/>
				),
				preview: isListLayout && (
					<Editor isLoading={ isSiteEditorLoading } />
				),
				mobile: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_POST_TYPE }
					/>
				),
			},
			widths: {
				content: isListLayout ? 380 : undefined,
			},
		};
	}

	// Template parts
	if ( path === '/wp_template_part/all' ) {
		return {
			areas: {
				content: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_PART_POST_TYPE }
					/>
				),
				preview: isListLayout && (
					<Editor isLoading={ isSiteEditorLoading } />
				),
				mobile: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_PART_POST_TYPE }
					/>
				),
			},
			widths: {
				content: isListLayout ? 380 : undefined,
			},
		};
	}

	// Patterns
	if ( path === '/patterns' ) {
		return {
			areas: {
				content: <PagePatterns />,
				mobile: <PagePatterns />,
			},
		};
	}

	// Fallback shows the home page preview
	return {
		areas: {
			preview: <Editor isLoading={ isSiteEditorLoading } />,
			mobile:
				canvas === 'edit' ? (
					<Editor isLoading={ isSiteEditorLoading } />
				) : undefined,
		},
	};
}
