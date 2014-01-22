var marked = require('marked');

var main_t = require('../tpl/templates.js')['editor-main'];
var tool_t = require('../tpl/templates.js')['editor-toolbar'];
var editor_t = require('../tpl/templates.js')['editor-editor'];
var preview_t = require('../tpl/templates.js')['editor-preview'];

function EditorView($el) {
    this.$el = $el;
    this.cm = null;
    this.onContentUpdated = function() {};
}

EditorView.prototype.render = function(data) {
    data = data || {};

    console.log('render editor', data);

    this.$el.innerHTML = main_t();
    this.$el.querySelector('.toolbar').innerHTML = tool_t(data);
    this.$el.querySelector('.content').innerHTML = editor_t(data);
    this.$el.querySelector('.content').innerHTML += preview_t(data);

    this.cm = CodeMirror(this.$el.querySelector('#cm'), {
        value: data.content || '',
        mode: 'markdown'
    });

    this.cm.on('change', function(e) {
        this.$el.querySelector('.preview').innerHTML = marked(this.getValue());
    }.bind(this));

    this.$el.querySelector('#show-preview').addEventListener('click', function() {
        this.$el.querySelector('.preview').classList.toggle('hidden');
    }.bind(this), false);
};

EditorView.prototype.destroy = function() {
    console.log('destroy editor view');
    this.cm = null;
    this.$el.innerHTML = '';
};

EditorView.prototype.getValue = function() {
    return this.cm.getValue();
};

module.exports = EditorView;