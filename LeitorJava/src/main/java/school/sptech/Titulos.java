package school.sptech;

public class Titulos {
    private Integer id;
    private String tipo;
    private String titulo;
    private String tituloOrig;
    private String sinopse;
    private String dtLancamento;
    private Double nota;
    private Integer qtdVotos;
    private Double popularidade;
    private String generos;
    private String classificacao;
    private String duracao;
    private String temporadas;
    private String totalEps;
    private String diretores;
    private String roteiristas;
    private String elenco;
    private String camPoster;
    private String linguagemOrig;


    public Titulos(Integer id, String tipo, String titulo, String tituloOrig, String sinopse,
                   String dtLancamento, Double nota, Integer qtdVotos, Double popularidade, String generos, String classificacao,
                   String duracao, String temporadas, String totalEps, String diretores, String roteiristas, String elenco, String camPoster, String linguagemOrig) {
        this.id = id;
        this.tipo = tipo;
        this.titulo = titulo;
        this.tituloOrig = tituloOrig;
        this.sinopse = sinopse;
        this.dtLancamento = dtLancamento;
        this.nota = nota;
        this.qtdVotos = qtdVotos;
        this.popularidade = popularidade;
        this.generos = generos;
        this.classificacao = classificacao;
        this.duracao = duracao;
        this.temporadas = temporadas;
        this.totalEps = totalEps;
        this.diretores = diretores;
        this.roteiristas = roteiristas;
        this.elenco = elenco;
        this.camPoster = camPoster;
        this.linguagemOrig = linguagemOrig;
    }

    public static Double converterDouble(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return Double.valueOf(valor.replace(",", "."));
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTituloOrig() {
        return tituloOrig;
    }

    public void setTituloOrig(String tituloOrig) {
        this.tituloOrig = tituloOrig;
    }

    public String getSinopse() {
        return sinopse;
    }

    public void setSinopse(String sinopse) {
        this.sinopse = sinopse;
    }

    public String getDtLancamento() {
        return dtLancamento;
    }

    public void setDtLancamento(String dtLancamento) {
        this.dtLancamento = dtLancamento;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public Integer getQtdVotos() {
        return qtdVotos;
    }

    public void setQtdVotos(Integer qtdVotos) {
        this.qtdVotos = qtdVotos;
    }

    public String getGeneros() {
        return generos;
    }

    public void setGeneros(String generos) {
        this.generos = generos;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }

    public String getDuracao() {
        return duracao;
    }

    public void setDuracao(String duracao) {
        this.duracao = duracao;
    }

    public String getDiretores() {
        return diretores;
    }

    public void setDiretores(String diretores) {
        this.diretores = diretores;
    }

    public String getRoteiristas() {
        return roteiristas;
    }

    public void setRoteiristas(String roteiristas) {
        this.roteiristas = roteiristas;
    }

    public String getElenco() {
        return elenco;
    }

    public void setElenco(String elenco) {
        this.elenco = elenco;
    }

    public String getTemporadas() {
        return temporadas;
    }

    public void setTemporadas(String temporadas) {
        this.temporadas = temporadas;
    }

    public String getTotalEps() {
        return totalEps;
    }

    public void setTotalEps(String totalEps) {
        this.totalEps = totalEps;
    }

    public Double getPopularidade() {
        return popularidade;
    }

    public void setPopularidade(Double popularidade) {
        this.popularidade = popularidade;
    }

    public String getCamPoster() {
        return camPoster;
    }

    public void setCamPoster(String camPoster) {
        this.camPoster = camPoster;
    }

    public String getLinguagemOrig() {
        return linguagemOrig;
    }

    public void setLinguagemOrig(String linguagemOrig) {
        this.linguagemOrig = linguagemOrig;
    }
}

