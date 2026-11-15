import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText
} from '@payloadcms/richtext-lexical/react'
import { Locale } from 'next-intl'

import { Card } from '@/blocks/Card/Component'
import { Collapsible } from '@/blocks/Collapsible/Component'
import { Events } from '@/blocks/Events/Component'
import { PDFViewer } from '@/blocks/PDFViewer/Component'
import { SectionCards } from '@/blocks/SectionCards/Component'
import { Team } from '@/blocks/Team/Component'
import { TwoColumns } from '@/blocks/TwoColumns/Component'
import type {
  CardBlock as CardBlockType,
  CollapsibleBlock as CollapsibleBlockType,
  EventsBlock as EventsBlockType,
  PDFViewerBlock as PdfViewerBlockType,
  SectionCardsBlock as SectionCardsBlockType,
  TeamBlock as TeamBlockType,
  TwoColumnsBlock as TwoColumnsBlockType
} from '@/payload-types'

import { internalDocToHref } from './internalDocToHref'
import ProseWrapper from './ProseWrapper'
import { renderCustomHeading } from './renderCustomHeading'
import { renderCustomText } from './renderCustomText'
import { renderCustomUpload } from './renderCustomUpload'

interface RichTextProps {
  data: SerializedEditorState
  locale: Locale
  extraClassName?: string
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CardBlockType
      | CollapsibleBlockType
      | EventsBlockType
      | PdfViewerBlockType
      | SectionCardsBlockType
      | TeamBlockType
      | TwoColumnsBlockType
    >

export const RichText = ({ data, locale, extraClassName }: RichTextProps) => {
  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: (linkNode) => internalDocToHref(linkNode, locale)
    }),
    heading: renderCustomHeading,
    text: renderCustomText,
    upload: renderCustomUpload,
    blocks: {
      ...defaultConverters.blocks,
      card: ({ node }) => <Card block={node.fields} locale={locale} />,
      collapsible: ({ node }) => <Collapsible block={node.fields} locale={locale} />,
      events: ({ node }) => <Events block={node.fields} locale={locale} />,
      'pdf-viewer': ({ node }) => <PDFViewer block={node.fields} />,
      'section-cards': ({ node }) => <SectionCards block={node.fields} />,
      team: ({ node }) => <Team block={node.fields} />,
      'two-columns': ({ node }) => <TwoColumns block={node.fields} locale={locale} />
    }
  })

  return (
    <ProseWrapper extraClassName={extraClassName}>
      <LexicalRichText disableContainer data={data} converters={jsxConverters} />
    </ProseWrapper>
  )
}
