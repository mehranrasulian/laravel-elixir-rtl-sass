import gulp from 'gulp';
import Elixir from 'laravel-elixir';
import postcss from 'gulp-postcss';
import rtlcss from 'rtlcss';

class RTLTask extends Elixir.Task {
    /**
     * Create a new RTLTask instance.
     *
     * @param {string}      name
     * @param {GulpPaths}   paths
     * @param {object|null} options
     */
    constructor(name, paths, options) {
        super(name, null, paths);

        this.options = options;
    }


    /**
     * Build the Gulp task.
     */
    gulpTask() {
        return (
            gulp
            .src(this.src.path)
            .pipe(this.initSourceMaps())
            .pipe(this.compile())
            .on('error', this.onError())
            .pipe(this.rtl())
            .on('error', this.onError())
            .pipe(this.autoPrefix())
            .pipe(this.concat())
            .pipe(this.minify())
            .on('error', this.onError())
            .pipe(this.writeSourceMaps())
            .pipe(this.saveAs(gulp))
            .pipe(this.onSuccess())
        );
    }

    /**
     * Register file watchers.
     */
    registerWatchers() {
        this.watch(this.src.baseDir + Elixir.config.css[this.name].search)
            .ignore(this.output.path);
    }

    /**
     * Compile the SASS.
     */
    compile() {
        this.recordStep('Compiling ' + this.ucName());

        let plugin = Elixir.Plugins.sass ||
                     Elixir.config.css[this.name].plugin;

        return plugin(
            this.options || Elixir.config.css[this.name].pluginOptions
        );
    }

    /**
     * RTL the CSS.
     */
    rtl() {
        return postcss([rtlcss]);
    }

    /**
     * Apply CSS auto-prefixing.
     */
    autoPrefix() {
        if (! Elixir.config.css.autoprefix.enabled) {
            return this.stream();
        }

        this.recordStep('Autoprefixing CSS');

        return Elixir.Plugins.autoprefixer(
            Elixir.config.css.autoprefix.options
        );
    }
}

export default RTLTask;