/**
 * Ukrainian strings the language pack lacks: the custom "Embed iframe" plugin and a few editor texts.
 *
 * TinyMCE translates dialog and button texts by looking them up in the language
 * data; the language pack (tinymce-i18n) knows nothing about this plugin, so its
 * texts are added here. `addI18n` merges them into the pack.
 */
const UK = {
  // Texts the language pack lacks: the title of the editing area and the code block button.
  'Rich Text Area': 'Область форматованого тексту',
  'Code Block': 'Блок коду',
  'Embed iframe': 'Вбудувати iframe',
  'Insert iframe': 'Вставити iframe',
  General: 'Загальні',
  Advanced: 'Додатково',
  'Source URL': 'URL джерела',
  Size: 'Розмір',
  'Inline Value': 'У рядку',
  'Big embed': 'Великий',
  'Small embed': 'Малий',
  Dimensions: 'Розміри',
  Name: 'Назва',
  Title: 'Заголовок',
  'Long description URL': 'URL розгорнутого опису',
  'Show iframe border': 'Показувати рамку iframe',
  Border: 'Рамка',
  'Enable scrollbar': 'Увімкнути прокрутку',
  Scrollbar: 'Прокрутка',
};

if (typeof window !== 'undefined' && window.tinymce?.addI18n) {
  window.tinymce.addI18n('uk', UK);
}

export default UK;
